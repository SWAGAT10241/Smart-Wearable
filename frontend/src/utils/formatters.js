/**
 * Data presentation and display formatters.
 */

/**
 * Format timestamp into localized relative time or short string.
 *
 * @param {string|Date|number} timestamp
 * @returns {string}
 */
export function formatTimeAgo(timestamp) {
  if (!timestamp) return "Never";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Format full date and time.
 *
 * @param {string|Date|number} timestamp
 * @returns {string}
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Format coordinates to 4 decimal places.
 *
 * @param {number} [lat]
 * @param {number} [lng]
 * @returns {string}
 */
export function formatCoordinates(lat, lng) {
  if (lat == null || lng == null) return "No GPS fix";
  return `${Number(lat).toFixed(4)}°, ${Number(lng).toFixed(4)}°`;
}

/**
 * Format numeric value with safe fallback.
 *
 * @param {number|null|undefined} val
 * @param {string} [unit=""]
 * @param {number} [precision=0]
 * @returns {string}
 */
export function formatValue(val, unit = "", precision = 0) {
  if (val == null || Number.isNaN(Number(val))) return "—";
  const formatted = precision > 0 ? Number(val).toFixed(precision) : Math.round(Number(val));
  return unit ? `${formatted} ${unit}` : `${formatted}`;
}

/**
 * Convert milliseconds to HH:MM:SS.
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
 * Extract safely parsed Date from a reading object.
 *
 * @param {object|string|number} reading
 * @param {*} [fallback]
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
 * Format timestamp into human-readable relative update text.
 *
 * @param {Date|object|string|number} timestamp
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

