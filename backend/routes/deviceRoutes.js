const express = require("express");

const Device = require("../models/Device");
const VitalsReading = require("../models/VitalsReading");
const EnvironmentReading = require("../models/EnvironmentReading");
const LocationReading = require("../models/LocationReading");
const FallEvent = require("../models/FallEvent");

const protect = require("../middleware/authMiddleware");

module.exports = function (broadcast) {
  const router = express.Router();

  // ─────────────────────────────────────────────
  // POST /api/device/register
  //
  // User connects/provisions a device.
  //
  // userId ALWAYS comes from JWT.
  // It is never accepted from request body.
  // ─────────────────────────────────────────────

  router.post("/register", protect, async (req, res) => {
    try {
      const { deviceId, deviceName } = req.body;

      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const normalizedDeviceId = deviceId.trim().toUpperCase();

      const existingDevice = await Device.findOne({
        deviceId: normalizedDeviceId,
      });

      if (existingDevice) {
        // Device already belongs to another user.
        if (
          existingDevice.userId &&
          existingDevice.userId.toString() !== req.userId.toString()
        ) {
          return res.status(409).json({
            error: "Device is already registered",
          });
        }

        // Already belongs to this user.
        return res.status(409).json({
          error: "Device already connected",
        });
      }

      const device = await Device.create({
        deviceId: normalizedDeviceId,

        // Hardware/default name.
        deviceName:
          typeof deviceName === "string" && deviceName.trim()
            ? deviceName.trim()
            : "TrailGuard Wearable",

        // Ownership comes from authenticated user.
        userId: req.userId,

        status: "active",
      });

      return res.status(201).json({
        success: true,

        device: {
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          status: device.status,
        },
      });
    } catch (error) {
      console.error("POST /api/device/register error:", error);

      // MongoDB duplicate-key protection.
      if (error.code === 11000) {
        return res.status(409).json({
          error: "Device already registered",
        });
      }

      return res.status(500).json({
        error: "Failed to register device",
      });
    }
  });

  // ─────────────────────────────────────────────
  // PATCH /api/device/:deviceId/name
  //
  // User changes the friendly device name.
  //
  // deviceId is only used to locate the user's own
  // device. Ownership is enforced using req.userId.
  // ─────────────────────────────────────────────

  router.patch("/:deviceId/name", protect, async (req, res) => {
    try {
      const { deviceName } = req.body;

      if (typeof deviceName !== "string" || !deviceName.trim()) {
        return res.status(400).json({
          error: "deviceName is required",
        });
      }

      const trimmedName = deviceName.trim();

      if (trimmedName.length > 50) {
        return res.status(400).json({
          error: "deviceName must be 50 characters or less",
        });
      }

      const normalizedDeviceId = req.params.deviceId.trim().toUpperCase();

      const device = await Device.findOneAndUpdate(
        {
          deviceId: normalizedDeviceId,
          userId: req.userId,
        },
        {
          deviceName: trimmedName,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!device) {
        return res.status(404).json({
          error: "Device not found",
        });
      }

      return res.json({
        success: true,

        device: {
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          status: device.status,
        },
      });
    } catch (error) {
      console.error("PATCH /api/device/:deviceId/name error:", error);

      return res.status(500).json({
        error: "Failed to update device name",
      });
    }
  });

  // ─────────────────────────────────────────────
  // POST /api/device/readings
  //
  // Device / LoRa gateway sends telemetry.
  //
  // IMPORTANT:
  // - No userId accepted from device.
  // - No user JWT required.
  // - deviceId identifies the physical device.
  // - Backend gets userId from Device.
  //
  // Device authentication will be added here.
  // ─────────────────────────────────────────────

  router.post("/readings", async (req, res) => {
    try {
      const {
        deviceId,heartRate,spo2,irSamples,
        temperature,humidity,pressure,latitude,
        longitude,altitude,satellites,fallDetected,
        accelX,accelY,accelZ,gyroX,gyroY,
        gyroZ,tiltAngle,totalAcceleration,
        peakAccelG,peakGyroDps,postureChangeDeg,
        severity,locationStale,timestamp,
      } = req.body;

      // Device identity is required.
      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }
      const normalizedDeviceId = deviceId.trim().toUpperCase();
      // Find active device.
      const device = await Device.findOne({
        deviceId: normalizedDeviceId,
        status: "active",
      });

      if (!device) {
        return res.status(401).json({
          error: "Unknown or inactive device",
        });
      }

      // Validate timestamp.
      const readingTimestamp = timestamp ? new Date(timestamp) : new Date();

      if (Number.isNaN(readingTimestamp.getTime())) {
        return res.status(400).json({
          error: "Invalid timestamp",
        });
      }

      const saved = {};

      // ─────────────────────────────────────────
      // VITALS
      // ─────────────────────────────────────────

      if (heartRate != null || spo2 != null) {
        if (heartRate == null || spo2 == null) {
          return res.status(400).json({
            error: "heartRate and spo2 must be provided together",
          });
        }

        const reading = await VitalsReading.create({
          deviceId: normalizedDeviceId,
          userId: device.userId,
          heartRate: Number(heartRate),
          spo2: Number(spo2),
          irSamples: Array.isArray(irSamples) ? irSamples : [],
          timestamp: readingTimestamp,
        });

        saved.vitals = reading;

        broadcast({
          type: "vitals",
          data: reading,
        });
      }

      // ─────────────────────────────────────────
      // ENVIRONMENT
      // ─────────────────────────────────────────

      if (temperature != null || humidity != null) {
        if (temperature == null || humidity == null) {
          return res.status(400).json({
            error: "temperature and humidity must be provided together",
          });
        }

        const reading = await EnvironmentReading.create({
          deviceId: normalizedDeviceId,
          userId: device.userId,
          temperature: Number(temperature),
          humidity: Number(humidity),
          pressure: pressure != null ? Number(pressure) : undefined,
          timestamp: readingTimestamp,
        });

        saved.environment = reading;

        broadcast({
          type: "environment",
          data: reading,
        });
      }

      // ─────────────────────────────────────────
      // LOCATION
      // ─────────────────────────────────────────

      if (latitude != null || longitude != null) {
        if (latitude == null || longitude == null) {
          return res.status(400).json({
            error: "latitude and longitude must be provided together",
          });
        }

        const reading = await LocationReading.create({
          deviceId: normalizedDeviceId,
          userId: device.userId,
          latitude: Number(latitude),
          longitude: Number(longitude),
          altitude: altitude != null ? Number(altitude) : undefined,
          satellites: satellites != null ? Number(satellites) : undefined,
          locationStale:
            locationStale != null ? Boolean(locationStale) : undefined,
          timestamp: readingTimestamp,
        });

        saved.location = reading;

        broadcast({
          type: "location",
          data: reading,
        });
      }

      // ─────────────────────────────────────────
      // FALL
      // ─────────────────────────────────────────

      if (fallDetected === true) {
        const fallEvent = await FallEvent.create({
          deviceId: normalizedDeviceId,
          userId: device.userId,

          accelX: accelX != null ? Number(accelX) : undefined,
          accelY: accelY != null ? Number(accelY) : undefined,
          accelZ: accelZ != null ? Number(accelZ) : undefined,

          tiltAngle: tiltAngle != null ? Number(tiltAngle) : undefined,
          totalAcceleration:totalAcceleration != null ? Number(totalAcceleration) : undefined,
          peakAccelG: peakAccelG != null ? Number(peakAccelG) : undefined,
          peakGyroDps: peakGyroDps != null ? Number(peakGyroDps) : undefined,
          postureChangeDeg:postureChangeDeg != null ? Number(postureChangeDeg) : undefined,
          severity: severity || "moderate",
          latitude: latitude != null ? Number(latitude) : undefined,
          longitude: longitude != null ? Number(longitude) : undefined,
          status: "detected",
          timestamp: readingTimestamp,
        });

        saved.fall = fallEvent;

        broadcast({
          type: "fall_detected",
          data: fallEvent,
        });
      }

      // ─────────────────────────────────────────
      // DEVICE STATUS
      // ─────────────────────────────────────────

      device.lastSeen = new Date();

      await device.save();
      return res.status(201).json({
        success: true,

        device: {
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          userId: device.userId,
          lastSeen: device.lastSeen,
        },

        saved,
      });
    } catch (error) {
      console.error("POST /api/device/readings error:", error);

      return res.status(500).json({
        error: "Failed to process device readings",
      });
    }
  });

  // ─────────────────────────────────────────────
  // GET /api/device/:deviceId
  //
  // Only the owner can see their device.
  // ─────────────────────────────────────────────

  router.get("/:deviceId", protect, async (req, res) => {
    try {
      const device = await Device.findOne({
        deviceId: req.params.deviceId.trim().toUpperCase(),

        userId: req.userId,
      }).select("deviceId deviceName status lastSeen createdAt updatedAt");

      if (!device) {
        return res.status(404).json({
          error: "Device not found",
        });
      }

      return res.json({
        device,
      });
    } catch (error) {
      console.error("GET /api/device/:deviceId error:", error);

      return res.status(500).json({
        error: "Failed to get device",
      });
    }
  });

  return router;
};
