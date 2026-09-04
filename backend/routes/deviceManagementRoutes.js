const express = require("express");

const Device = require("../models/Device");
const protect = require("../middleware/authMiddleware");

module.exports = function () {
  const router = express.Router();

  /*
   * GET /api/devices
   *
   * Returns only devices belonging to the logged-in user.
   */
  router.get("/", protect, async (req, res) => {
    try {
      const devices = await Device.find({
        userId: req.userId,
      })
        .select("deviceId deviceName status lastSeen createdAt updatedAt")
        .sort({ createdAt: -1 })
        .lean();

      res.json({
        devices,
      });
    } catch (error) {
      console.error("GET /api/devices error:", error);

      res.status(500).json({
        error: "Failed to get devices",
      });
    }
  });

  /*
   * GET /api/devices/:deviceId
   *
   * User can only retrieve their own device.
   */
  router.delete("/:deviceId", protect, async (req, res) => {
    try {
      const deviceId = req.params.deviceId.trim().toUpperCase();

      const device = await Device.findOneAndUpdate(
        {
          deviceId,
          userId: req.userId,
        },
        {
          $set: {
            status: "inactive",
            userId: null,
          },
        },
        {
          new: true,
          runValidators: false,
        },
      ).select("deviceId deviceName status lastSeen");

      if (!device) {
        return res.status(404).json({
          error: "Device not found",
        });
      }

      return res.json({
        success: true,
        message: "Device unpaired",
        device,
      });
    } catch (error) {
      console.error("DELETE /api/devices/:deviceId error:", error);

      return res.status(500).json({
        error: "Failed to unpair device",
      });
    }
  });

  /*
   * PATCH /api/devices/:deviceId
   *
   * Rename device.
   *
   * IMPORTANT:
   * deviceId cannot be changed.
   */
  router.patch("/:deviceId", protect, async (req, res) => {
    try {
      const deviceId = req.params.deviceId.trim().toUpperCase();

      const { deviceName } = req.body;

      if (typeof deviceName !== "string") {
        return res.status(400).json({
          error: "deviceName must be a string",
        });
      }

      const trimmedName = deviceName.trim();

      if (!trimmedName) {
        return res.status(400).json({
          error: "deviceName cannot be empty",
        });
      }

      if (trimmedName.length > 50) {
        return res.status(400).json({
          error: "deviceName cannot exceed 50 characters",
        });
      }

      const device = await Device.findOneAndUpdate(
        {
          deviceId,
          userId: req.userId,
        },
        {
          $set: {
            deviceName: trimmedName,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).select("deviceId deviceName status lastSeen createdAt updatedAt");

      if (!device) {
        return res.status(404).json({
          error: "Device not found",
        });
      }

      res.json({
        success: true,
        device,
      });
    } catch (error) {
      console.error("PATCH /api/devices/:deviceId error:", error);

      res.status(500).json({
        error: "Failed to rename device",
      });
    }
  });

  /*
   * PATCH /api/devices/:deviceId/status
   *
   * User can activate/deactivate their own device.
   */
  router.patch("/:deviceId/status", protect, async (req, res) => {
    try {
      const deviceId = req.params.deviceId.trim().toUpperCase();

      const { status } = req.body;

      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          error: "status must be active or inactive",
        });
      }

      const device = await Device.findOneAndUpdate(
        {
          deviceId,
          userId: req.userId,
        },
        {
          $set: {
            status,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).select("deviceId deviceName status lastSeen createdAt updatedAt");

      if (!device) {
        return res.status(404).json({
          error: "Device not found",
        });
      }

      res.json({
        success: true,
        device,
      });
    } catch (error) {
      console.error("PATCH /api/devices/:deviceId/status error:", error);

      res.status(500).json({
        error: "Failed to update device status",
      });
    }
  });

  /*
   * DELETE /api/devices/:deviceId
   *
   * Removes ownership of the device.
   *
   * We deactivate rather than physically delete it so
   * historical telemetry remains traceable.
   */
  router.delete("/:deviceId", protect, async (req, res) => {
    try {
      const deviceId = req.params.deviceId.trim().toUpperCase();

      const device = await Device.findOneAndUpdate(
        {
          deviceId,
          userId: req.userId,
        },
        {
          $set: {
            status: "inactive",
          },
        },
        {
          new: true,
        },
      ).select("deviceId deviceName status lastSeen");

      if (!device) {
        return res.status(404).json({
          error: "Device not found",
        });
      }

      res.json({
        success: true,
        message: "Device disconnected",
        device,
      });
    } catch (error) {
      console.error("DELETE /api/devices/:deviceId error:", error);

      res.status(500).json({
        error: "Failed to disconnect device",
      });
    }
  });

  return router;
};
