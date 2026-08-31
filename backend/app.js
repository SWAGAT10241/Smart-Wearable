const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();
require("./config/passport");

// Routes
const authRoutes = require("./routes/authRoutes");
const vitalsRoutes = require("./routes/vitalsRoutes");
const fallRoutes = require("./routes/fallRoutes");
const environmentRoutes = require("./routes/environmentRoutes");
const locationRoutes = require("./routes/locationRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const deviceRegistrationRoutes = require("./routes/deviceRegistrationRoutes");
const deviceManagementRoutes = require("./routes/deviceManagementRoutes");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Basic production configuration

app.disable("x-powered-by");

if (isProduction) {app.set("trust proxy", 1)}
// Security headers
app.use(helmet({crossOriginResourcePolicy: {policy: "cross-origin"}}));
// CORS
const allowedOrigin = process.env.CLIENT_URL;
app.use(cors({origin: allowedOrigin,credentials: true}));

// JSON body parser
//
// Keep the limit small because TrailGuard telemetry
// packets are relatively small.
//

app.use(express.json({limit: "100kb"}));
// ─────────────────────────────────────────────
// Session configuration
// ─────────────────────────────────────────────

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "test-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
};

// Use MongoDB-backed sessions when MongoDB is configured.
const isTest = process.env.NODE_ENV === "test";
if (process.env.MONGODB_URI && !isTest) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60,
  });
}

app.use(session(sessionOptions));

// Passport

app.use(passport.initialize());

// Authentication rate limiting
// Protect login/register endpoints from brute-force requests.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts. Please try again later.",
  },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// WebSocket clients
const clients = new Set();
function broadcast(message) {
  const payload = JSON.stringify(message);
  clients.forEach((client) => {
    try {
      if (client && client.readyState === client.OPEN) {
        client.send(payload);
      }
    } catch (error) {
      console.error("WebSocket broadcast error:", error.message);
    }
  });
}
// Routes
// Authentication
app.use("/api/auth", authRoutes);
// One-time physical device activation.
// Logged-in user claims a TrailGuard wearable.
app.use("/api/devices", deviceRegistrationRoutes());
// Device → Backend
// Physical hardware sends telemetry here.
app.use("/api/device", deviceRoutes(broadcast));
// User → Device management
// Frontend uses these routes to:
// - list devices
// - view a device
// - rename a device
// - activate/deactivate a device
// - disconnect a device
app.use("/api/devices", deviceManagementRoutes());

// Dashboard → Backend

app.use("/api/vitals", vitalsRoutes());
app.use("/api/falls", fallRoutes(broadcast));
app.use("/api/environment", environmentRoutes());
app.use("/api/location", locationRoutes());

// Health check

app.get("/", (req, res) => {
  res.status(200).json({
    status: "TrailGuard backend running",
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});
// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: isProduction ? "Internal server error" : err.message,
  });
});

module.exports = {app,clients};