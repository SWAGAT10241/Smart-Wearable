/**
 * 404 Not Found Middleware.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl}`,
    code: "NOT_FOUND",
  });
};

module.exports = notFoundHandler;
