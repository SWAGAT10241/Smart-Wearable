const express = require("express");
const LocationReading = require("../models/LocationReading");
const protect = require("../middleware/authMiddleware");

module.exports = function () {
  const router = express.Router();
  router.use(protect);
  // GET /api/location/latest
  router.get("/latest", async (req, res) => {
    try {
      const reading = await LocationReading.findOne({
        userId: req.userId,
      }).sort({
        timestamp: -1,
      });
      res.json(reading || {});
    } catch (err) {
      console.error("GET /location/latest error:", err);
      res.status(500).json({
        error: "Failed to fetch latest location",
      });
    }
  });
  // GET /api/location/history
  router.get("/history", async (req, res) => {
    try {
      const hours = Number(req.query.hours ?? 24);
      if (!Number.isFinite(hours) || hours <= 0) {
        return res.status(400).json({
          error: "hours must be a positive number",
        });
      }
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);
      const readings = await LocationReading.find({
        userId: req.userId,
        timestamp: {
          $gte: since,
        },
      }).sort({
        timestamp: 1,
      });
      res.json(readings);
    } catch (err) {
      console.error("GET /location/history error:", err);

      res.status(500).json({
        error: "Failed to fetch location history",
      });
    }
  });
  return router;
};