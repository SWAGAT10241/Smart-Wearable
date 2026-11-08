/**
 * Formatting utilities for timestamps, durations, and sensor readings.
 */

/**
 * Format milliseconds into HH:MM:SS string.
 *
 * @param {number} milliseconds
 * @returns {string|null}
 */
export function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return null;

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

/**
 * Extract or normalize Date object from reading payload.
 *
 * @param {object} reading
 * @param {Date|string} [fallback]
 * @returns {Date|null}
 */
export function getReadingTimestamp(reading, fallback) {
  const timestamp =
    reading?.timestamp ||
    reading?.createdAt ||
    reading?.recordedAt ||
    reading?._receivedAt ||
    fallback;

  if (!timestamp) return null;

  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Format timestamp into relative "Just now" or "X min ago" string.
 *
 * @param {Date|string|object} timestamp
 * @returns {string}
 */
export function formatUpdatedText(timestamp) {
  const date =
    timestamp instanceof Date ? timestamp : getReadingTimestamp(timestamp);

  if (!date) return "Waiting for data";

  const seconds = Math.floor(Math.max(0, Date.now() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours === 1) return "1 hour ago";

  return `${hours} hours ago`;
}

/**
 * Format numeric values with fallback and precision.
 *
 * @param {number|null|undefined} value
 * @param {number} [decimals=1]
 * @param {string} [fallback="--"]
 * @returns {string}
 */
export function formatReadingValue(value, decimals = 1, fallback = "--") {
  if (value == null || !Number.isFinite(Number(value))) {
    return fallback;
  }
  const num = Number(value);
  return Number.isInteger(num) ? String(num) : num.toFixed(decimals);
}
