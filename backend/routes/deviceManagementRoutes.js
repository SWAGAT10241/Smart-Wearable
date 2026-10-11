const express = require("express");
const rateLimit = require("express-rate-limit");
const protect = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");
const deviceController = require("../controllers/deviceController");

module.exports = function () {
  const router = express.Router();

  const devicesLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const adminDevicesLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // GET /api/devices/admin/all — Administrator-only device management
  router.get(
    "/admin/all",
    adminDevicesLimiter,
    protect,
    authorizeRole("admin"),
    deviceController.getAllDevicesAdmin,
  );

  // GET /api/devices — User's connected devices
  router.get("/", devicesLimiter, protect, deviceController.getUserDevices);

  // DELETE /api/devices/:deviceId — Unpair device
  router.delete("/:deviceId", devicesLimiter, protect, deviceController.unpairDevice);

  // PATCH /api/devices/:deviceId — Rename device
  router.patch("/:deviceId", protect, deviceController.renameDevice);

  // PATCH /api/devices/:deviceId/status — Activate/deactivate device
  router.patch("/:deviceId/status", protect, deviceController.updateStatus);

  return router;
};
