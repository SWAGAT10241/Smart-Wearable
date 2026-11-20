const express = require("express");
const protect = require("../middleware/authMiddleware");
const { deviceLimiter } = require("../middleware/rateLimiter");
const deviceRegistrationController = require("../controllers/deviceRegistrationController");

module.exports = function () {
  const router = express.Router();

  router.post(
    "/pairing-challenges",
    deviceLimiter,
    protect,
    deviceRegistrationController.startPairingChallenge,
  );
  router.post(
    "/pairing-challenges/:challengeId/complete",
    deviceLimiter,
    protect,
    deviceRegistrationController.completePairingChallenge,
  );
  router.post(
    "/telemetry-receipts",
    deviceLimiter,
    protect,
    deviceRegistrationController.getTelemetryReceipt,
  );
  router.post(
    "/register",
    protect,
    deviceRegistrationController.rejectLegacyRegistration,
  );

  return router;
};
