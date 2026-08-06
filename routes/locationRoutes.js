const express = require('express');
const LocationReading = require('../models/LocationReading');

module.exports = function (broadcast) {
  const router = express.Router();

  // POST /api/location — ESP32 (Neo-6M GPS) pushes a new fix
  router.post('/', async (req, res) => {
    try {
      const { deviceId, latitude, longitude, altitude, satellites, userId } = req.body;
      if (!deviceId || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'deviceId, latitude, and longitude are required' });
      }

      const reading = await LocationReading.create({
        deviceId, latitude, longitude, altitude, satellites, userId,
      });

      broadcast({ type: 'location', data: reading });
      res.status(201).json(reading);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/location/latest?deviceId=xxx
  router.get('/latest', async (req, res) => {
    const { deviceId } = req.query;
    const reading = await LocationReading.findOne({ deviceId }).sort({ timestamp: -1 });
    res.json(reading || {});
  });

  // GET /api/location/history?deviceId=xxx&hours=24
  // Full trail path — every point recorded, for redrawing the route on the map
  router.get('/history', async (req, res) => {
    const { deviceId, hours = 24 } = req.query;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const readings = await LocationReading.find({
      deviceId,
      timestamp: { $gte: since },
    }).sort({ timestamp: 1 });
    res.json(readings);
  });

  return router;
};
