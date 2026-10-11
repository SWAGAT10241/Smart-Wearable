const SAFE_FIELDS = new Set([
  "method",
  "route",
  "statusCode",
  "durationMs",
  "count",
  "port",
  "errorName",
  "errorCode",
]);

const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function safeIdentifier(value) {
  return typeof value === "string" && /^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(value)
    ? value
    : undefined;
}

function normalizeFields(fields) {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return {};
  }

  const normalized = {};

  for (const [key, value] of Object.entries(fields)) {
    if (key === "error" && value && typeof value === "object") {
      const errorName = safeIdentifier(value.name);
      if (errorName) normalized.errorName = errorName;

      if (typeof value.code === "number" && Number.isFinite(value.code)) {
        normalized.errorCode = value.code;
      }
      continue;
    }

    if (!SAFE_FIELDS.has(key)) continue;

    if (key === "method") {
      if (typeof value === "string" && /^[A-Z]{3,10}$/.test(value)) {
        normalized[key] = value;
      }
      continue;
    }

    if (key === "route") {
      if (
        typeof value === "string" &&
        value.length <= 120 &&
        /^[A-Za-z0-9_/:.*-]+$/.test(value)
      ) {
        normalized[key] = value;
      }
      continue;
    }

    if (key === "errorName") {
      const safeValue = safeIdentifier(value);
      if (safeValue) normalized[key] = safeValue;
      continue;
    }

    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      if (
        (key === "statusCode" && value >= 100 && value <= 599) ||
        (key === "port" && value <= 65535) ||
        (key !== "statusCode" && key !== "port")
      ) {
        normalized[key] = value;
      }
    }
  }

  return normalized;
}

function emit(level, event, fields = {}) {
  const environment = process.env.NODE_ENV || "development";
  if (environment === "test") return;
  if (!Object.hasOwn(LEVELS, level)) {
    throw new TypeError(`Unsupported log level: ${level}`);
  }
  const minimumLevel =
    environment === "production" || process.env.DEBUG !== "true" ? LEVELS.info : LEVELS.debug;
  if (LEVELS[level] < minimumLevel) return;
  if (typeof event !== "string" || !/^[a-z][a-z0-9_.-]{0,79}$/.test(event)) {
    throw new TypeError("Log event must be a safe, lowercase identifier");
  }

  const record = {
    timestamp: new Date().toISOString(),
    level,
    environment,
    event,
    ...normalizeFields(fields),
  };

  if (environment === "production") {
    console[level === "debug" ? "log" : level](JSON.stringify(record));
    return;
  }

  const metadata = Object.entries(record)
    .filter(([key]) => !["timestamp", "level", "environment", "event"].includes(key))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(" ");
  console[level === "debug" ? "log" : level](
    `${record.timestamp} ${level.toUpperCase()} ${event}${metadata ? ` ${metadata}` : ""}`,
  );
}

module.exports = {
  debug: (event, fields) => emit("debug", event, fields),
  info: (event, fields) => emit("info", event, fields),
  warn: (event, fields) => emit("warn", event, fields),
  error: (event, fields) => emit("error", event, fields),
};
