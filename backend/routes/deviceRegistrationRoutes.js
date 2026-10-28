const express = require("express");
const { createLimiter } = require("../middleware/rateLimiter");
const protect = require("../middleware/authMiddleware");
const deviceRegistrationController = require("../controllers/deviceRegistrationController");

function userPairingLimiter() {
  return createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    keyGenerator: (req) => String(req.userId),
    message: { error: "Too many pairing attempts. Please try again later." },
  });
}

/**
 * Express router for secure device pairing and receipt authorization.
 * Mounted at `/api/devices`.
 */
module.exports = function () {
  const router = express.Router();

  // POST /api/devices/pairing-challenges — Start pairing challenge
  router.post(
    "/pairing-challenges",
    protect,
    userPairingLimiter(),
    deviceRegistrationController.startPairingChallenge,
  );

  // POST /api/devices/pairing-challenges/:challengeId/complete — Complete pairing with Ed25519 proof
  router.post(
    "/pairing-challenges/:challengeId/complete",
    protect,
    userPairingLimiter(),
    deviceRegistrationController.completePairingChallenge,
  );

  // POST /api/devices/telemetry-receipts — Issue short-lived telemetry session receipt
  router.post(
    "/telemetry-receipts",
    protect,
    userPairingLimiter(),
    deviceRegistrationController.getTelemetryReceipt,
  );

  // POST /api/devices/register — Legacy ID-only registration disabled (410 Gone)
  router.post(
    "/register",
    protect,
    deviceRegistrationController.rejectLegacyRegistration,
  );

  return router;
};
