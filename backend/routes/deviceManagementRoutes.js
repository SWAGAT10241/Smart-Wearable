const express = require("express");
const protect = require("../middleware/authMiddleware");
const deviceController = require("../controllers/deviceController");

module.exports = function () {
  const router = express.Router();

  // GET /api/devices — User's connected devices
  router.get("/", protect, deviceController.getUserDevices);

  // DELETE /api/devices/:deviceId — Unpair device
  router.delete("/:deviceId", protect, deviceController.unpairDevice);

  // PATCH /api/devices/:deviceId — Rename device
  router.patch("/:deviceId", protect, deviceController.renameDevice);

  // PATCH /api/devices/:deviceId/status — Activate/deactivate device
  router.patch("/:deviceId/status", protect, deviceController.updateStatus);

  return router;
};
