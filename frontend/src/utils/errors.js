/**
 * Custom Error class representing API and HTTP transportation errors.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Error description
   * @param {number} [status=500] - HTTP status code
   * @param {string} [code="API_ERROR"] - Error machine-readable code
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
