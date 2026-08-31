const express = require("express");
const VitalsReading = require("../models/VitalsReading");
const protect = require("../middleware/authMiddleware");

module.exports = function () {
  const router = express.Router();
  router.use(protect);

  // ----------------------------------------------------------
  // GET /api/vitals/latest
  // ----------------------------------------------------------
  router.get("/latest", async (req, res) => {
    try {
      const { deviceId } = req.query;
      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }
      const reading = await VitalsReading.findOne({
        userId: req.userId,
        deviceId: deviceId.toUpperCase(),
      }).sort({
        timestamp: -1,
      });
      res.json(reading || {});
    } catch (err) {
      console.error("GET /vitals/latest error:", err);
      res.status(500).json({
        error: "Failed to fetch latest vitals",
      });
    }
  });

  // ----------------------------------------------------------
  // GET /api/vitals/history
  // ----------------------------------------------------------
  router.get("/history", async (req, res) => {
    try {
      const { deviceId } = req.query;
      const hours = Number(req.query.hours ?? 1);
      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }
      if (!Number.isFinite(hours) || hours <= 0) {
        return res.status(400).json({
          error: "hours must be a positive number",
        });
      }
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);
      const readings = await VitalsReading.find({
        userId: req.userId,
        deviceId: deviceId.toUpperCase(),
        timestamp: {
          $gte: since,
        },
      }).sort({
        timestamp: 1,
      });
      res.json(readings);
    } catch (err) {
      console.error("GET /vitals/history error:", err);
      res.status(500).json({
        error: "Failed to fetch vitals history",
      });
    }
  });

  // ----------------------------------------------------------
  // GET /api/vitals/stats
  // ----------------------------------------------------------
  router.get("/stats", async (req, res) => {
    try {
      const { deviceId } = req.query;
      const hours = Number(req.query.hours ?? 1);
      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }
      if (!Number.isFinite(hours) || hours <= 0) {
        return res.status(400).json({
          error: "hours must be a positive number",
        });
      }
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);
      const result = await VitalsReading.aggregate([
        {
          $match: {
            userId: req.userId,
            deviceId: deviceId.toUpperCase(),
            timestamp: { $gte: since },
          },
        },
        {
          $group: {
            _id: null,
            minHeartRate: { $min: "$heartRate" },
            averageHeartRate: { $avg: "$heartRate" },
            maxHeartRate: { $max: "$heartRate" },
            minSpo2: { $min: "$spo2" },
            averageSpo2: { $avg: "$spo2" },
            maxSpo2: { $max: "$spo2" },
            readingCount: { $sum: 1 },
          },
        },
      ]);
      const stats = result[0];
      if (!stats) {
        return res.json({
          minHeartRate: null,
          averageHeartRate: null,
          maxHeartRate: null,
          minSpo2: null,
          averageSpo2: null,
          maxSpo2: null,
          readingCount: 0,
        });
      }
      res.json({
        minHeartRate:stats.minHeartRate != null ? Math.round(stats.minHeartRate) : null,
        averageHeartRate:stats.averageHeartRate != null? Math.round(stats.averageHeartRate): null,
        maxHeartRate:stats.maxHeartRate != null ? Math.round(stats.maxHeartRate) : null,
        minSpo2: stats.minSpo2 != null ? Math.round(stats.minSpo2) : null,
        averageSpo2:stats.averageSpo2 != null? Number(stats.averageSpo2.toFixed(1)): null,
        maxSpo2: stats.maxSpo2 != null ? Math.round(stats.maxSpo2) : null,
        readingCount: stats.readingCount,
      });
    } catch (err) {
      console.error("GET /vitals/stats error:", err);
      res.status(500).json({
        error: "Failed to calculate vitals statistics",
      });
    }
  });

  return router;
};
