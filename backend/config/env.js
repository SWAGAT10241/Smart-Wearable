require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const config = {
  env: process.env.NODE_ENV || "development",
  isProduction,
  isTest,
  port: parseInt(process.env.PORT || "3000", 10),
  clientUrls,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/trailguard",
  jwtSecret: process.env.JWT_SECRET || (isTest ? "test-secret" : "default-dev-secret-change-in-production"),
  sessionSecret: process.env.SESSION_SECRET || (isTest ? "test-session" : "default-session-secret"),
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
  },
  twilio: {
    accountSid: process.env.TWILIO_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || "",
  },
};

module.exports = config;
