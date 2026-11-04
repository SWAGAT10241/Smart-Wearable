const express = require("express");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");
const mongoose = require("mongoose");

const config = require("./config/env");
require("./config/passport");

const { clients, broadcast } = require("./realtime/socketManager");
const { createApiRouter } = require("./routes");
const notFoundHandler = require("./middleware/notFoundHandler");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");

const app = express();

// Disable x-powered-by header
app.disable("x-powered-by");

if (config.isProduction) {
  app.set("trust proxy", 1);
  if (config.clientUrls.length === 0) {
    throw new Error("CLIENT_URLS must be configured in production");
  }
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
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Device-ID",
      "X-Device-Timestamp",
      "X-Device-Nonce",
      "X-Device-Signature",
    ],
  }),
);

// JSON body parser with strict size limit and rawBody capture for device auth
app.use(
  express.json({
    limit: "100kb",
    verify: (req, res, buffer) => {
      if (req.originalUrl === "/api/device/readings") {
        req.rawBody = Buffer.from(buffer);
      }
    },
  }),
);

app.use(passport.initialize());

// Authentication rate limiting to prevent brute-force attacks
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Backwards-compatible status endpoint.
app.get("/", (req, res) => {
  res.status(200).json({
    status: "TrailGuard backend running",
  });
});

// Process liveness for container orchestration. This must remain dependency-free.
app.get("/livez", (req, res) => {
  res.status(200).json({ status: "live" });
});

// Readiness gates traffic on the only mandatory runtime dependency: MongoDB.
app.get("/readyz", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not_ready",
    dependencies: { mongodb: ready ? "ready" : "unavailable" },
  });
});

// Scalable API Router protected by global API rate limiter
app.use("/api", apiLimiter, createApiRouter(broadcast));

// 404 Route Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = {
  app,
  clients,
  broadcast,
};
