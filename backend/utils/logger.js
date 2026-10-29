/**
 * Centralized, security-hardened structured logger.
 * Automatically redacts sensitive fields (passwords, tokens, coordinates, vitals, phone numbers)
 * to prevent accidental PII/secret leakage in logs.
 */

const isTest = process.env.NODE_ENV === "test";
const isProduction = process.env.NODE_ENV === "production";

const SENSITIVE_KEY_PATTERNS = [
  /passw(or)?d/i,
  /token/i,
  /secret/i,
  /auth(orization)?/i,
  /bearer/i,
  /cookie/i,
  /ticket/i,
  /nonce/i,
  /signature/i,
  /^key$/i,
  /privateKey/i,
  /bootstrapToken/i,
  /heartRate/i,
  /spo2/i,
  /latitude/i,
  /longitude/i,
  /coordinate/i,
  /phoneNumber/i,
  /contactPhone/i,
];

function sanitizeValue(value, depth = 0) {
  if (depth > 5) return "[DEPTH_LIMIT]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value.replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]");
  }
  if (typeof value !== "object") return value;

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message ? value.message.replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]") : "",
      stack: isProduction ? undefined : value.stack,
      code: value.code,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, depth + 1));
  }

  const sanitized = {};
  for (const [k, v] of Object.entries(value)) {
    if (SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(k))) {
      sanitized[k] = "[REDACTED]";
    } else {
      sanitized[k] = sanitizeValue(v, depth + 1);
    }
  }
  return sanitized;
}

function isProductionEnv() {
  return process.env.NODE_ENV === "production";
}

function isTestEnv() {
  return process.env.NODE_ENV === "test";
}

function formatLog(level, message, ...meta) {
  const timestamp = new Date().toISOString();
  const sanitizedMeta = meta.map((m) => sanitizeValue(m));

  if (isProductionEnv()) {
    const logObject = {
      timestamp,
      level,
      message: typeof message === "string" ? message : sanitizeValue(message),
      ...(sanitizedMeta.length > 0 ? { details: sanitizedMeta } : {}),
    };
    return JSON.stringify(logObject);
  }

  const metaStr =
    sanitizedMeta.length > 0
      ? " " + sanitizedMeta.map((m) => (typeof m === "object" ? JSON.stringify(m) : m)).join(" ")
      : "";
  return `[${level}] ${timestamp} ${message}${metaStr}`;
}

const logger = {
  info: (message, ...meta) => {
    if (!isTestEnv()) console.log(formatLog("INFO", message, ...meta));
  },
  warn: (message, ...meta) => {
    if (!isTestEnv()) console.warn(formatLog("WARN", message, ...meta));
  },
  error: (message, ...meta) => {
    if (!isTestEnv()) console.error(formatLog("ERROR", message, ...meta));
  },
  debug: (message, ...meta) => {
    if (process.env.DEBUG === "true" && !isTestEnv()) {
      console.debug(formatLog("DEBUG", message, ...meta));
    }
  },
};

module.exports = logger;
