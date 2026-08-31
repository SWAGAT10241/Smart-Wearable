const express = require("express");
const EnvironmentReading = require("../models/EnvironmentReading");
const protect = require("../middleware/authMiddleware");

module.exports = function () {
  const router = express.Router();
  router.use(protect);

  // ----------------------------------------------------------
  // GET /api/environment/latest
  // ----------------------------------------------------------
  router.get("/latest", async (req, res) => {
    try {
      const { deviceId } = req.query;

      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const reading = await EnvironmentReading.findOne({
        userId: req.userId,
        deviceId: deviceId.toUpperCase(),
      }).sort({
        timestamp: -1,
      });

      res.json(reading || {});
    } catch (err) {
      console.error("GET /environment/latest error:", err);

      res.status(500).json({
        error: "Failed to fetch latest environment reading",
      });
    }
  });

  // ----------------------------------------------------------
  // GET /api/environment/history
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
      const readings = await EnvironmentReading.find({
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
      console.error("GET /environment/history error:", err);

      res.status(500).json({
        error: "Failed to fetch environment history",
      });
    }
  });

  // ----------------------------------------------------------
  // GET /api/environment/stats
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
      const result = await EnvironmentReading.aggregate([
        {
          $match: {
            userId: req.userId,
            deviceId: deviceId.toUpperCase(),
            timestamp: {
              $gte: since,
            },
          },
        },
        {
          $group: {
            _id: null,
            minTemperature: {$min: "$temperature"},
            averageTemperature: {$avg: "$temperature"},
            maxTemperature: {$max: "$temperature"},
            minHumidity: {$min: "$humidity"},
            averageHumidity: {$avg: "$humidity"},
            maxHumidity: {$max: "$humidity"},
            minPressure: {$min: "$pressure"},
            averagePressure: {$avg: "$pressure"},
            maxPressure: {$max: "$pressure"},
            readingCount: {$sum: 1},
          },
        },
      ]);
      const stats = result[0];
      if (!stats) {
        return res.json({
          minTemperature: null,
          averageTemperature: null,
          maxTemperature: null,
          minHumidity: null,
          averageHumidity: null,
          maxHumidity: null,
          minPressure: null,
          averagePressure: null,
          maxPressure: null,
          readingCount: 0,
        });
      }
      res.json({
        minTemperature:stats.minTemperature != null? Number(stats.minTemperature.toFixed(1)): null,
        averageTemperature:stats.averageTemperature != null? Number(stats.averageTemperature.toFixed(1)): null,
        maxTemperature:stats.maxTemperature != null? Number(stats.maxTemperature.toFixed(1)): null,
        
        minHumidity:stats.minHumidity != null? Number(stats.minHumidity.toFixed(1)): null,
        averageHumidity:stats.averageHumidity != null? Number(stats.averageHumidity.toFixed(1)): null,
        maxHumidity:stats.maxHumidity != null? Number(stats.maxHumidity.toFixed(1)): null,

        minPressure:stats.minPressure != null? Number(stats.minPressure.toFixed(1)): null,
        averagePressure:stats.averagePressure != null? Number(stats.averagePressure.toFixed(1)): null,
        maxPressure:stats.maxPressure != null? Number(stats.maxPressure.toFixed(1)): null,
        
        readingCount: stats.readingCount});
    } catch (err) {
      console.error("GET /environment/stats error:", err);
      res.status(500).json({
        error: "Failed to calculate environment statistics",
      });
    }
  });
  return router;
};
