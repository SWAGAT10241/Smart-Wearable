const express = require("express");
const VitalsReading = require("../models/VitalsReading");

module.exports = function (broadcast) {
  const router = express.Router();

  // POST /api/vitals — ESP32 pushes a new MAX30102 reading
  router.post('/', async (req, res) => {
  try {
    const {deviceId,heartRate,spo2,irSamples,userId,} = req.body;

    if (!deviceId || heartRate == null || spo2 == null) {
      return res.status(400).json({
        error: 'deviceId, heartRate, and spo2 are required',
      });
    }

    const reading = await VitalsReading.create({
      deviceId,heartRate,spo2,
      irSamples: Array.isArray(irSamples) ? irSamples : [],userId,});

    broadcast({
      type: 'vitals',
      data: reading,
    });

    res.status(201).json(reading);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

  // GET /api/vitals/latest?deviceId=xxx
  router.get("/latest", async (req, res) => {
    const { deviceId } = req.query;
    const reading = await VitalsReading.findOne({ deviceId }).sort({
      timestamp: -1,
    });
    res.json(reading || {});
  });

  // GET /api/vitals/history?deviceId=xxx&hours=1
  router.get("/history", async (req, res) => {
    const { deviceId, hours = 1 } = req.query;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const readings = await VitalsReading.find({
      deviceId,
      timestamp: { $gte: since },
    }).sort({ timestamp: 1 });
    res.json(readings);
  });

  return router;
};
