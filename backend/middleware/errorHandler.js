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

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";
  let code = err.code;

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid request data";
    code = "VALIDATION_ERROR";
  }

  // Handle Mongoose Bad ObjectId / Cast Error
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier";
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

  // Never expose internal errors, database details, or stack information to clients.
  if (statusCode >= 500) {
    message = "Internal server error";
    code = "INTERNAL_ERROR";
  }

  if (statusCode >= 500) {
    logger.error("http.request.failed", {
      method: req.method,
      route: req.route?.path || "unmatched",
      statusCode,
      error: err,
    });
  } else {
    logger.warn("http.request.rejected", {
      method: req.method,
      route: req.route?.path || "unmatched",
      statusCode,
      error: err,
    });
  }

  const responseBody = {
    error: message,
  };

  if (
    code &&
    typeof code === "string" &&
    code !== "INTERNAL_ERROR" &&
    (err instanceof AppError || statusCode < 500)
  ) {
    responseBody.code = code;
  }

  if (err instanceof AppError && statusCode < 500 && err.details) {
    responseBody.details = err.details;
  }

  return res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
