/**
 * Standardized API response wrappers.
 */

function sendSuccess(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json(data);
}

function sendCreated(res, data = {}) {
  return res.status(201).json(data);
}

function sendError(res, message = "An error occurred", statusCode = 500, code = "ERROR") {
  return res.status(statusCode).json({
    error: message,
    code,
  });
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
};
