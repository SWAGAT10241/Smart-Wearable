const express = require('express');
const EnvironmentReading = require('../models/EnvironmentReading');

module.exports = function (broadcast) {
  const router = express.Router();

  // POST /api/environment — ESP32 (DHT22) pushes a new reading
  router.post('/', async (req, res) => {
    try {
      const { deviceId, temperature, humidity, userId } = req.body;
      if (!deviceId || temperature == null || humidity == null) {
        return res.status(400).json({ error: 'deviceId, temperature, and humidity are required' });
      }

      const reading = await EnvironmentReading.create({ deviceId, temperature, humidity, userId });
      broadcast({ type: 'environment', data: reading });
      res.status(201).json(reading);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/environment/latest?deviceId=xxx
  router.get('/latest', async (req, res) => {
    const { deviceId } = req.query;
    const reading = await EnvironmentReading.findOne({ deviceId }).sort({ timestamp: -1 });
    res.json(reading || {});
  });

  // GET /api/environment/average?deviceId=xxx&hours=1
  // Returns avg temperature and avg humidity over the given window
  router.get('/average', async (req, res) => {
    const { deviceId, hours = 1 } = req.query;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const result = await EnvironmentReading.aggregate([
      { $match: { deviceId, timestamp: { $gte: since } } },
      {
        $group: {
          _id: null,
          avgTemperature: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          readingCount: { $sum: 1 },
        },
      },
    ]);

    res.json(result[0] || { avgTemperature: null, avgHumidity: null, readingCount: 0 });
  });

  // GET /api/environment/history?deviceId=xxx&hours=1
  router.get('/history', async (req, res) => {
    const { deviceId, hours = 1 } = req.query;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const readings = await EnvironmentReading.find({
      deviceId,
      timestamp: { $gte: since },
    }).sort({ timestamp: 1 });
    res.json(readings);
  });

  return router;
};
