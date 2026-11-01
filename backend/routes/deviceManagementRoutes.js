const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");
const { deviceLimiter, adminLimiter } = require("../middleware/rateLimiter");
const deviceController = require("../controllers/deviceController");

module.exports = function () {
  const router = express.Router();

  // GET /api/devices/admin/all — Administrator-only device management
  router.get(
    "/admin/all",
    adminLimiter,
    protect,
    authorizeRole("admin"),
    deviceController.getAllDevicesAdmin,
  );

  // GET /api/devices — User's connected devices
  router.get("/", deviceLimiter, protect, deviceController.getUserDevices);

  // DELETE /api/devices/:deviceId — Unpair device
  router.delete("/:deviceId", deviceLimiter, protect, deviceController.unpairDevice);

  // PATCH /api/devices/:deviceId — Rename device
  router.patch("/:deviceId", deviceLimiter, protect, deviceController.renameDevice);

  // PATCH /api/devices/:deviceId/status — Activate/deactivate device
  router.patch("/:deviceId/status", deviceLimiter, protect, deviceController.updateStatus);

  return router;
};
