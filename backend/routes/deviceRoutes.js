const express = require("express");
const protect = require("../middleware/authMiddleware");
const deviceAuth = require("../middleware/deviceAuthMiddleware");
const { deviceLimiter, telemetryLimiter } = require("../middleware/rateLimiter");
const deviceController = require("../controllers/deviceController");
const telemetryController = require("../controllers/telemetryController");

module.exports = function (broadcast) {
  const router = express.Router();

  // POST /api/device/register — ID-only registration is disabled
  router.post("/register", deviceLimiter, protect, (req, res) =>
    res.status(410).json({
      error:
        "ID-only device registration is disabled; use the secure pairing flow",
    }),
  );

  // PATCH /api/device/:deviceId/name — User changes the friendly device name
  router.patch("/:deviceId/name", deviceLimiter, protect, deviceController.renameDevice);

  // POST /api/device/readings — Device sends telemetry (requires device Ed25519 auth)
  router.post(
    "/readings",
    telemetryLimiter,
    deviceAuth,
    telemetryController.ingestReadings(broadcast),
  );

  // GET /api/device/:deviceId — Owner gets device details
  router.get(
    "/:deviceId",
    deviceLimiter,
    protect,
    deviceController.getDevice,
  );

  return router;
};
