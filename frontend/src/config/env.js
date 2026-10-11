/**
 * Centralized and validated frontend environment configuration.
 * All environment variable accesses should pass through this module.
 */

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const normalizedApi = rawApiUrl.replace(/\/+$/, "");

export const API_URL = normalizedApi.endsWith("/api")
  ? normalizedApi
  : `${normalizedApi}/api`;

export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/live";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "TrailGuard";

export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;

export const config = Object.freeze({
  apiUrl: API_URL,
  wsUrl: WS_URL,
  appName: APP_NAME,
  isProduction: IS_PRODUCTION,
  isDevelopment: IS_DEVELOPMENT,
});

export default config;
