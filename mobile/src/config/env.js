/**
 * Mobile environment configuration.
 * Centralizes Expo public environment variables.
 */
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

export const WS_URL =
  process.env.EXPO_PUBLIC_WS_URL || "ws://localhost:3000/live";

export default {
  API_URL,
  WS_URL,
};
