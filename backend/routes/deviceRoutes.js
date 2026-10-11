const express = require("express");
const protect = require("../middleware/authMiddleware");
const { deviceLimiter, telemetryLimiter } = require("../middleware/rateLimiter");
const deviceController = require("../controllers/deviceController");
const telemetryController = require("../controllers/telemetryController");

module.exports = function (broadcast) {
  const router = express.Router();

  // POST /api/device/register — User connects/provisions a device
  router.post("/register", deviceLimiter, protect, deviceController.registerDevice(false));

  // PATCH /api/device/:deviceId/name — User changes the friendly device name
  router.patch("/:deviceId/name", deviceLimiter, protect, deviceController.renameDevice);

  // POST /api/device/readings — Device sends telemetry
  router.post("/readings", telemetryLimiter, telemetryController.ingestReadings(broadcast));

  // GET /api/device/:deviceId — Owner gets device details
  router.get("/:deviceId", deviceLimiter, protect, deviceController.getDevice);

  return router;
};
