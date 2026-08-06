const mongoose = require('mongoose');

// Neo-6M GPS sensor data — full location history, so a trail path can be
// reconstructed later, not just the current position
const locationReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  altitude: {
    type: Number, // meters
  },
  satellites: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('LocationReading', locationReadingSchema);
