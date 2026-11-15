const express = require("express");
const protect = require("../middleware/authMiddleware");
const { deviceLimiter, telemetryLimiter } = require("../middleware/rateLimiter");
const deviceAuth = require("../middleware/deviceAuthMiddleware");
const deviceController = require("../controllers/deviceController");
const telemetryController = require("../controllers/telemetryController");

module.exports = function (broadcast) {
  const router = express.Router();

  // ID-only device registration is disabled; use the secure pairing flow.
  router.post("/register", protect, (req, res) =>
    res.status(410).json({
      error: "ID-only device registration is disabled; use the secure pairing flow",
    }),
  );

  // PATCH /api/device/:deviceId/name — User changes the friendly device name
  router.patch("/:deviceId/name", deviceLimiter, protect, deviceController.renameDevice);

  // POST /api/device/readings — Device sends telemetry
  router.post(
    "/readings",
    telemetryLimiter,
    deviceAuth,
    telemetryController.ingestReadings(broadcast),
  );

  // GET /api/device/:deviceId — Owner gets device details
  router.get("/:deviceId", deviceLimiter, protect, deviceController.getDevice);

  return router;
};
