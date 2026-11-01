/**
 * Higher-order function to wrap async Express route handlers
 * and pass any caught errors to the next() error middleware.
 *
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express route handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
