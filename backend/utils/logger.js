const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "refreshtoken",
  "jwt",
  "secret",
  "authorization",
  "ticket",
  "heartrate",
  "spo2",
  "latitude",
  "longitude",
  "phonenumber",
  "phone",
  "nonce",
  "signature",
  "privatekey",
]);

const SENSITIVE_PATTERNS = [
  /([?&](?:token|ticket|password|%70assword|latitude|longitude)=)([^&\s"']+)/gi,
  /(Bearer\s+)[^\s"']+/gi,
];

function sanitizeString(str) {
  if (typeof str !== "string") return str;
  let result = str;
  for (const pattern of SENSITIVE_PATTERNS) {
    result = result.replace(pattern, "$1[REDACTED]");
  }
  return result;
}

function sanitizeValue(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return sanitizeString(value);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value instanceof Error) {
    return {
      name: value.name,
      message: sanitizeString(value.message),
      stack: sanitizeString(value.stack),
    };
  }
  if (typeof value === "object") {
    const sanitized = {};
    for (const [k, v] of Object.entries(value)) {
      const lower = k.toLowerCase();
      if (
        SENSITIVE_KEYS.has(lower) ||
        lower.includes("password") ||
        lower.includes("token") ||
        lower.includes("secret") ||
        lower.includes("ticket") ||
        lower.includes("latitude") ||
        lower.includes("longitude") ||
        lower.includes("heartrate") ||
        lower.includes("spo2") ||
        lower.includes("phone")
      ) {
        sanitized[k] = "[REDACTED]";
      } else {
        sanitized[k] = sanitizeValue(v);
      }
    }
    return sanitized;
  }
  return String(value);
}

function formatLog(level, msgOrObj, ...args) {
  const isProduction = process.env.NODE_ENV === "production";
  let message = "";
  let meta = {};

  if (typeof msgOrObj === "string") {
    message = sanitizeString(msgOrObj);
  } else if (msgOrObj instanceof Error) {
    message = sanitizeString(msgOrObj.message);
  } else if (typeof msgOrObj === "object" && msgOrObj !== null) {
    const sanitized = sanitizeValue(msgOrObj);
    if (sanitized.message) {
      message = sanitized.message;
      delete sanitized.message;
    }
    if (sanitized.url && !message) {
      message = sanitized.url;
      delete sanitized.url;
    }
    meta = { ...meta, ...sanitized };
  } else {
    message = String(msgOrObj);
  }

  if (args.length > 0) {
    for (const arg of args) {
      if (typeof arg === "object" && arg !== null) {
        meta = { ...meta, ...sanitizeValue(arg) };
      } else {
        message += (message ? " " : "") + sanitizeValue(arg);
      }
    }
  }

  if (isProduction) {
    const payload = {
      level,
      message: message || undefined,
      ...meta,
    };
    return JSON.stringify(payload);
  } else {
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `[${level.toUpperCase()}] ${message}${metaStr}`;
  }
}

const logger = {
  info: (msg, ...args) => console.log(formatLog("info", msg, ...args)),
  warn: (msg, ...args) => console.warn(formatLog("warn", msg, ...args)),
  error: (msg, ...args) => console.error(formatLog("error", msg, ...args)),
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatLog("debug", msg, ...args));
    }
  },
};

module.exports = logger;
