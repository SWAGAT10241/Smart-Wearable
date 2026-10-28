/**
 * Standardized API and Network Error class for TrailGuard Mobile.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - User-friendly error message
   * @param {number} [status=500] - HTTP status code (0 for network errors)
   * @param {string} [code="API_ERROR"] - Machine-readable error code
   * @param {any} [details=null] - Optional detailed error context
   */
  constructor(message, status = 500, code = "API_ERROR", details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export default ApiError;

