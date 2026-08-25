const express = require("express");
const VitalsReading = require("../models/VitalsReading");

module.exports = function (broadcast) {
  const router = express.Router();

  // POST /api/vitals
  // ESP32 / simulator sends MAX30102 data
  router.post("/", async (req, res) => {
    try {
      const { deviceId, heartRate, spo2, irSamples, userId, timestamp } =
        req.body;

      if (!deviceId || heartRate == null || spo2 == null) {
        return res.status(400).json({
          error: "deviceId, heartRate, and spo2 are required",
        });
      }

      const reading = await VitalsReading.create({
        deviceId,
        heartRate,
        spo2,
        irSamples: Array.isArray(irSamples) ? irSamples : [],
        userId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      });

      broadcast({
        type: "vitals",
        data: reading,
      });

      res.status(201).json(reading);
    } catch (err) {
      console.error("POST /vitals error:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  });

  // GET /api/vitals/latest?deviceId=xxx
  router.get("/latest", async (req, res) => {
    try {
      const { deviceId } = req.query;

      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const reading = await VitalsReading.findOne({
        deviceId,
      }).sort({
        timestamp: -1,
      });

      res.json(reading || {});
    } catch (err) {
      console.error("GET /vitals/latest error:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  });

  // GET /api/vitals/history?deviceId=xxx&hours=1
  router.get("/history", async (req, res) => {
    try {
      const { deviceId, hours = 1 } = req.query;

      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const since = new Date(Date.now() - Number(hours) * 60 * 60 * 1000);

      const readings = await VitalsReading.find({
        deviceId,
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
        error: err.message,
      });
    }
  });

  // GET /api/vitals/stats?deviceId=xxx&hours=1
  router.get("/stats", async (req, res) => {
    try {
      const { deviceId, hours = 1 } = req.query;

      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const since = new Date(Date.now() - Number(hours) * 60 * 60 * 1000);

      const result = await VitalsReading.aggregate([
        {
          $match: {
            deviceId,
            timestamp: {
              $gte: since,
            },
          },
        },
        {
          $group: {
            _id: null,

            minHeartRate: {
              $min: "$heartRate",
            },

            averageHeartRate: {
              $avg: "$heartRate",
            },

            maxHeartRate: {
              $max: "$heartRate",
            },

            minSpo2: {
              $min: "$spo2",
            },

            averageSpo2: {
              $avg: "$spo2",
            },

            maxSpo2: {
              $max: "$spo2",
            },

            readingCount: {
              $sum: 1,
            },
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
        minHeartRate: Math.round(stats.minHeartRate),
        averageHeartRate: Math.round(stats.averageHeartRate),
        maxHeartRate: Math.round(stats.maxHeartRate),

        minSpo2: Math.round(stats.minSpo2),
        averageSpo2: Number(stats.averageSpo2.toFixed(1)),
        maxSpo2: Math.round(stats.maxSpo2),

        readingCount: stats.readingCount,
      });
    } catch (err) {
      console.error("GET /vitals/stats error:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  });

  return router;
};
