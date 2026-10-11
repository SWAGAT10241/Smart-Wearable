/**
 * Centralized Express Error Handling Middleware.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (err.status ? err.status : 500);
  const message = err.message || "Internal server error";
  const code = err.code || "INTERNAL_ERROR";

  if (statusCode >= 500 && process.env.NODE_ENV !== "test") {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    error: message,
    ...(code ? { code } : {}),
  });
};

module.exports = errorHandler;
