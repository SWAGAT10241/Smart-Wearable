const express = require("express");

const Device = require("../models/Device");
const protect = require("../middleware/authMiddleware");

module.exports = function () {
  const router = express.Router();

  /**
   * POST /api/devices/register
   *
   * One-time device activation/registration.
   *
   * The deviceId comes from the physical wearable.
   * The userId comes from the authenticated user.
   */
  router.post("/register", protect, async (req, res) => {
    try {
      const { deviceId, deviceName } = req.body;

      // Validate device ID
      if (typeof deviceId !== "string" || !deviceId.trim()) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const normalizedDeviceId = deviceId.trim().toUpperCase();

      // Optional device name
      const normalizedDeviceName =
        typeof deviceName === "string" && deviceName.trim()
          ? deviceName.trim()
          : "TrailGuard Wearable";

      // Check whether this physical device already exists
      const existingDevice = await Device.findOne({
        deviceId: normalizedDeviceId,
      });

      if (existingDevice) {
        // Already belongs to this user
        if (existingDevice.userId.toString() === req.userId.toString()) {
          return res.status(200).json({
            success: true,
            message: "Device is already registered to your account",
            device: {
              deviceId: existingDevice.deviceId,
              deviceName: existingDevice.deviceName,
              status: existingDevice.status,
            },
          });
        }

        // Device belongs to another account
        return res.status(409).json({
          error: "Device is already registered to another user",
        });
      }

      // Create the one-time device ownership record
      const device = await Device.create({
        deviceId: normalizedDeviceId,
        deviceName: normalizedDeviceName,
        userId: req.userId,
        status: "active",
      });

      return res.status(201).json({
        success: true,
        message: "Device registered successfully",
        device: {
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          status: device.status,
        },
      });
    } catch (error) {
      console.error("POST /api/devices/register error:", error);

      // Handle MongoDB duplicate deviceId race condition
      if (error.code === 11000) {
        return res.status(409).json({
          error: "Device is already registered",
        });
      }

      return res.status(500).json({
        error: "Failed to register device",
      });
    }
  });

  return router;
};
