/**
 * Response helper utilities providing standardized payload generation
 * while preserving full backwards compatibility with existing clients and test suites.
 */

function successResponse(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json(data);
}

function errorResponse(res, message, statusCode = 500, code = "ERROR", details = null) {
  const payload = {
    error: message,
  };

  if (code && code !== "ERROR") {
    payload.code = code;
  }

  if (details) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  successResponse,
  errorResponse,
};
