const express = require('express');
const FallEvent = require('../models/FallEvent');

module.exports = function (broadcast) {
  const router = express.Router();

  // POST /api/falls — ESP32 (MPU6050) reports a fall event
  router.post('/', async (req, res) => {
    try {
      const {
        deviceId, userId, accelX, accelY, accelZ,
        tiltAngle, totalAcceleration, severity, latitude, longitude,
      } = req.body;

      if (!deviceId) {
        return res.status(400).json({ error: 'deviceId is required' });
      }

      const fallEvent = await FallEvent.create({
        deviceId, userId, accelX, accelY, accelZ,
        tiltAngle, totalAcceleration, severity, latitude, longitude,
        status: 'detected',
      });

      // Real-time alert push — this is the event that should trigger the
      // SOS popup on the dashboard
      broadcast({ type: 'fall_detected', data: fallEvent });

      res.status(201).json(fallEvent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/falls — ALL past fall records (full history), most recent first
  router.get('/', async (req, res) => {
    const { deviceId } = req.query;
    const filter = deviceId ? { deviceId } : {};
    const events = await FallEvent.find(filter).sort({ timestamp: -1 });
    res.json(events);
  });

  // GET /api/falls/latest
  router.get('/latest', async (req, res) => {
    const { deviceId } = req.query;
    const event = await FallEvent.findOne({ deviceId }).sort({ timestamp: -1 });
    res.json(event || {});
  });

  // PATCH /api/falls/:id — update status (e.g. "I'm okay" cancel, or SOS confirmed)
  router.patch('/:id', async (req, res) => {
    try {
      const { status } = req.body;
      const event = await FallEvent.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      broadcast({ type: 'fall_status_update', data: event });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
