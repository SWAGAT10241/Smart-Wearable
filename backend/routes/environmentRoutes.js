const express = require("express");
const EnvironmentReading = require("../models/EnvironmentReading");

module.exports = function (broadcast) {
  const router = express.Router();

  // POST /api/environment
  router.post("/", async (req, res) => {
    try {
      const { deviceId, temperature, humidity, pressure, userId, timestamp } =
        req.body;

      if (!deviceId || temperature == null || humidity == null) {
        return res.status(400).json({
          error: "deviceId, temperature, and humidity are required",
        });
      }

      const reading = await EnvironmentReading.create({
        deviceId,
        temperature,
        humidity,
        userId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      });

      broadcast({
        type: "environment",
        data: reading,
      });

      res.status(201).json(reading);
    } catch (err) {
      console.error("POST /environment error:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  });

  // GET /api/environment/latest
  router.get("/latest", async (req, res) => {
    try {
      const { deviceId } = req.query;

      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const reading = await EnvironmentReading.findOne({
        deviceId,
      }).sort({
        timestamp: -1,
      });

      res.json(reading || {});
    } catch (err) {
      console.error("GET /environment/latest error:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  });

  // GET /api/environment/history
  router.get("/history", async (req, res) => {
    try {
      const { deviceId, hours = 1 } = req.query;

      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const since = new Date(Date.now() - Number(hours) * 60 * 60 * 1000);

      const readings = await EnvironmentReading.find({
        deviceId,
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
        error: err.message,
      });
    }
  });

  // GET /api/environment/stats
  router.get("/stats", async (req, res) => {
    try {
      const { deviceId, hours = 1 } = req.query;

      if (!deviceId) {
        return res.status(400).json({
          error: "deviceId is required",
        });
      }

      const since = new Date(Date.now() - Number(hours) * 60 * 60 * 1000);

      const result = await EnvironmentReading.aggregate([
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

            minTemperature: {
              $min: "$temperature",
            },

            averageTemperature: {
              $avg: "$temperature",
            },

            maxTemperature: {
              $max: "$temperature",
            },

            minHumidity: {
              $min: "$humidity",
            },

            averageHumidity: {
              $avg: "$humidity",
            },

            maxHumidity: {
              $max: "$humidity",
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
          minTemperature: null,
          averageTemperature: null,
          maxTemperature: null,

          minHumidity: null,
          averageHumidity: null,
          maxHumidity: null,

          readingCount: 0,
        });
      }

      res.json({
        minTemperature: Number(stats.minTemperature.toFixed(1)),

        averageTemperature: Number(stats.averageTemperature.toFixed(1)),

        maxTemperature: Number(stats.maxTemperature.toFixed(1)),

        minHumidity: Number(stats.minHumidity.toFixed(1)),

        averageHumidity: Number(stats.averageHumidity.toFixed(1)),

        maxHumidity: Number(stats.maxHumidity.toFixed(1)),

        readingCount: stats.readingCount,
      });
    } catch (err) {
      console.error("GET /environment/stats error:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  });

  return router;
};
