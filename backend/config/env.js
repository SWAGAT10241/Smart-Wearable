require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

// Validate core requirements
const requiredInProduction = ["MONGODB_URI", "JWT_SECRET", "SESSION_SECRET"];

if (isProduction) {
  for (const key of requiredInProduction) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long in production");
  }

  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long in production");
  }
}

// Default local development origins
const defaultDevOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Parse client URLs
const configuredOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = isProduction
  ? configuredOrigins
  : Array.from(new Set([...configuredOrigins, ...defaultDevOrigins]));

if (isProduction && allowedOrigins.length === 0) {
  throw new Error("CLIENT_URLS must be configured in production");
}

const config = Object.freeze({
  env: process.env.NODE_ENV || "development",
  isProduction,
  isTest,
  port: parseInt(process.env.PORT || "3000", 10),
  serverUrl: process.env.SERVER_URL || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || (isTest ? "test-jwt-secret" : "default-development-jwt-secret-please-change-in-prod"),
  sessionSecret: process.env.SESSION_SECRET || (isTest ? "test-session-secret" : "default-development-session-secret-please-change"),
  clientUrls: allowedOrigins,
  twilio: {
    sid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
});

module.exports = config;
