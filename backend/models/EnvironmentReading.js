const mongoose = require('mongoose');

// DHT22 sensor data: ambient temperature + humidity
const environmentReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  temperature: {
    type: Number, // Celsius
    required: true,
  },
  humidity: {
    type: Number, // %
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('EnvironmentReading', environmentReadingSchema);