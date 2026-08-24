const mongoose = require('mongoose');

// MAX30102 sensor data: heart rate + blood oxygen
const vitalsReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  heartRate: {
    type: Number, // bpm
    required: true,
  },
  spo2: {
    type: Number, // %
    required: true,
  },
  irSamples: {
    type: [Number],
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('VitalsReading', vitalsReadingSchema);