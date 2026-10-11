/**
 * Mobile runtime environment configuration with safe fallbacks for bundling and testing.
 */

const rawApiUrl =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000/api";

export const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl}/api`;

export const WS_URL =
  process.env.EXPO_PUBLIC_WS_URL || "ws://localhost:3000/live";

export default {
  API_URL,
  WS_URL,
};
