const express = require("express");
const rateLimit = require("express-rate-limit");
const protect = require("../middleware/authMiddleware");
const deviceController = require("../controllers/deviceController");
const telemetryController = require("../controllers/telemetryController");

module.exports = function (broadcast) {
  const router = express.Router();

  const deviceReadLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: "Too many device requests. Please try again later.",
    },
  });

  // POST /api/device/register — User connects/provisions a device
  router.post("/register", protect, deviceController.registerDevice(false));

  // PATCH /api/device/:deviceId/name — User changes the friendly device name
  router.patch("/:deviceId/name", protect, deviceController.renameDevice);

  // POST /api/device/readings — Device sends telemetry
  router.post("/readings", telemetryController.ingestReadings(broadcast));

  // GET /api/device/:deviceId — Owner gets device details
  router.get("/:deviceId", deviceReadLimiter, protect, deviceController.getDevice);

  return router;
};
