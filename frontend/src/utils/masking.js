/**
 * Masks hardware device IDs and sensitive identifiers for UI presentation.
 * Prevents full hardware serials/IDs from being leaked in screen shares or UI screenshots.
 *
 * Example: "TRAILGUARD-DEMO-001" -> "TRAI••••-001"
 *
 * @param {string} deviceId
 * @returns {string} Masked device ID
 */
export function maskDeviceId(deviceId) {
  if (!deviceId || typeof deviceId !== "string") return "••••••••";
  const trimmed = deviceId.trim();
  if (trimmed.length <= 6) return `TG-••••`;
  const prefix = trimmed.slice(0, 4);
  const suffix = trimmed.slice(-4);
  return `${prefix}-••••-${suffix}`;
}
