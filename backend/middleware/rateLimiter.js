const rateLimit = require("express-rate-limit");
const config = require("../config/env");

/**
 * Factory helper for consistent express-rate-limit configuration.
 * Automatically skips rate-limiting during automated testing to avoid flakiness.
 */
function createLimiter(options = {}) {
  return rateLimit({
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => config.isTest,
    ...options,
  });
}

/**
 * General API Limiter (applied to all /api routes).
 * Allows 300 requests per 15 minutes per IP.
 */
const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: {
    success: false,
    error: "Too many API requests. Please try again later.",
  },
});

/**
 * Sensitive Authentication Limiter.
 * Protects login, registration, and OTP verification against brute-force attacks.
 * Allows 20 requests per 15 minutes.
 */
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    error: "Too many authentication attempts. Please try again later.",
  },
});

/**
 * Telemetry Ingestion Limiter.
 * Protects device sensor data submission (/api/device/readings).
 * Allows 120 submissions per minute (2 Hz).
 */
const telemetryLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 120,
  message: {
    success: false,
    error: "Too many telemetry submissions. Please slow down.",
  },
});

/**
 * Device Management Limiter.
 * Protects device registration, listing, renaming, and removal.
 * Allows 100 requests per 15 minutes.
 */
const deviceLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    error: "Too many device requests. Please try again later.",
  },
});

/**
 * Administrative Limiter.
 * Protects privileged admin endpoints.
 * Allows 50 requests per 15 minutes.
 */
const adminLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  message: {
    success: false,
    error: "Too many administrative requests. Please try again later.",
  },
});

/**
 * Telemetry Query Limiter.
 * Protects historical and analytics queries (vitals, environment, location, falls).
 * Allows 120 requests per minute.
 */
const queryLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 120,
  message: {
    success: false,
    error: "Too many telemetry queries. Please try again later.",
  },
});

module.exports = {
  createLimiter,
  apiLimiter,
  authLimiter,
  telemetryLimiter,
  deviceLimiter,
  adminLimiter,
  queryLimiter,
};
