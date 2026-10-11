const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const config = require("./config/env");
require("./config/passport");

const { clients, broadcast } = require("./realtime/socketManager");
const { createApiRouter } = require("./routes");
const notFoundHandler = require("./middleware/notFoundHandler");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Disable x-powered-by header
app.disable("x-powered-by");

if (config.isProduction) {
  app.set("trust proxy", 1);
}

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS setup
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser or server-to-server requests
      if (!origin) return callback(null, true);

      if (config.clientUrls.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// JSON body parser with strict size limit
app.use(express.json({ limit: "100kb" }));

// Session configuration
const sessionOptions = {
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
};

// Use MongoDB-backed sessions when MongoDB is configured and not testing
if (config.mongoUri && !config.isTest) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: config.mongoUri,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60,
  });
}

app.use(session(sessionOptions));
app.use(passport.initialize());

// Authentication rate limiting to prevent brute-force attacks
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

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "TrailGuard backend running",
  });
});

// Scalable API Router
app.use("/api", createApiRouter(broadcast));

// 404 Route Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = {
  app,
  clients,
  broadcast,
};
