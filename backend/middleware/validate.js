/**
 * Generic request validation middleware
 * Validates request components (body, query, params) against schema validators
 *
 * @param {Function} validator - A function (data) => { error, value }
 * @param {string} source - 'body' | 'query' | 'params' (defaults to 'body')
 */
const validate = (validator, source = "body") => {
  return (req, res, next) => {
    if (typeof validator !== "function") {
      return next();
    }

    const { error, value } = validator(req[source]);

    if (error) {
      const details = Array.isArray(error.details)
        ? error.details.map((d) => d.message || d)
        : [error.message || String(error)];

      return res.status(400).json({
        error: "Validation error",
        message: details[0],
        details,
      });
    }

    // Replace request payload with sanitized/coerced value if provided
    if (value !== undefined) {
      req[source] = value;
    }

    next();
  };
};

module.exports = validate;
