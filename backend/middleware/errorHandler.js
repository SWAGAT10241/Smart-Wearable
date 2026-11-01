const AppError = require("../utils/appError");
const logger = require("../utils/logger");

/**
 * Centralized error handling middleware.
 * Ensures consistent error JSON responses, prevents leaking internal stack traces in production,
 * and maintains compatibility with existing clients and tests.
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const isProduction = process.env.NODE_ENV === "production";
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";
  let code = err.code;

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    code = "VALIDATION_ERROR";
  }

  // Handle Mongoose Bad ObjectId / Cast Error
  if (err.name === "CastError") {
    statusCode = 400;
    message = isProduction ? "Invalid identifier provided" : `Invalid ${err.path}: ${err.value}`;
    code = "INVALID_ID";
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    code = "DUPLICATE_KEY";
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
    code = "INVALID_TOKEN";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired";
    code = "TOKEN_EXPIRED";
  }

  // Sanitize internal server errors in production
  if (statusCode === 500 && isProduction) {
    message = "Internal server error";
  }

  const sanitizedMethod = String(req.method || "").replace(/\n|\r/g, "").slice(0, 10);
  const sanitizedUrl = encodeURI(String(req.originalUrl || "").replace(/\n|\r/g, "")).slice(0, 500);
  const sanitizedLogMessage = String(message || "").replace(/\n|\r/g, "").slice(0, 500);

  if (statusCode >= 500) {
    logger.error(`[500 ERROR] ${sanitizedMethod} ${sanitizedUrl}:`, err);
  } else {
    logger.warn(`[${statusCode} CLIENT ERROR] ${sanitizedMethod} ${sanitizedUrl}: ${sanitizedLogMessage}`);
  }

  const responseBody = {
    error: message,
  };

  if (code && typeof code === "string" && code !== "INTERNAL_ERROR") {
    responseBody.code = code;
  }

  if (err.details) {
    responseBody.details = err.details;
  }

  return res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
