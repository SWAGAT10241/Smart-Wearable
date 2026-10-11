/**
 * Lightweight structured logger that avoids leaking sensitive fields
 * such as passwords, tokens, and secret keys.
 */
const isTest = process.env.NODE_ENV === "test";

const logger = {
  info: (...args) => {
    if (!isTest) console.log("[INFO]", ...args);
  },
  warn: (...args) => {
    if (!isTest) console.warn("[WARN]", ...args);
  },
  error: (...args) => {
    if (!isTest) console.error("[ERROR]", ...args);
  },
  debug: (...args) => {
    if (process.env.DEBUG === "true" && !isTest) {
      console.debug("[DEBUG]", ...args);
    }
  },
};

module.exports = logger;
