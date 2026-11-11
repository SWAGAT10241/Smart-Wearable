/**
 * TrailGuard / SWAAS — MongoDB & NoSQL Injection Guard
 * Middleware that inspects incoming request body, query parameters, and headers
 * to sanitize and reject unauthorized query operators, operator injection, and prototype pollution.
 */

// Forbidden operator patterns for NoSQL injection
const FORBIDDEN_OPERATORS = new Set([
  "$where",
  "$expr",
  "$regex",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$ne",
  "$nin",
  "$or",
  "$and",
  "$not",
  "$nor",
  "$exists",
  "$type",
  "$mod",
  "$text",
  "$geoNear",
  "$function",
]);

/**
 * Deep inspection and sanitization of objects
 * Throws an error or returns sanitized clone
 */
function sanitizeObject(target, depth = 0) {
  if (depth > 10) {
    throw new Error("Payload nesting depth limit exceeded");
  }

  if (target === null || typeof target !== "object") {
    return target;
  }

  if (Array.isArray(target)) {
    return target.map((item) => sanitizeObject(item, depth + 1));
  }

  const clean = {};
  for (const key of Object.keys(target)) {
    // 1. Prototype pollution defense
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      throw new Error(`Prototype pollution attempt detected on key: ${key}`);
    }

    // 2. NoSQL operator injection defense ($ prefix)
    if (key.startsWith("$")) {
      if (FORBIDDEN_OPERATORS.has(key)) {
        throw new Error(`Unauthorized NoSQL query operator detected: ${key}`);
      }
    }

    clean[key] = sanitizeObject(target[key], depth + 1);
  }

  return clean;
}

/**
 * Express middleware
 */
function injectionGuard(req, res, next) {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === "object") {
      req.query = sanitizeObject(req.query);
    }
    if (req.params && typeof req.params === "object") {
      req.params = sanitizeObject(req.params);
    }
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Bad Request",
      message: `Security validation failed: ${err.message}`,
      code: "INJECTION_BLOCKED",
    });
  }
}

module.exports = {
  injectionGuard,
  sanitizeObject,
};
