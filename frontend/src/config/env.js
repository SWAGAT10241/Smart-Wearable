/**
 * Frontend environment configuration.
 * Centralizes Vite environment variables and fallbacks.
 */
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

export const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:3000/live";

export default {
  API_URL,
  WS_URL,
};
