const mongoose = require('mongoose');

// MPU6050 sensor data — every fall detection event, kept permanently so
// past records can always be queried (not just the latest one)
const fallEventSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  accelX: Number,
  accelY: Number,
  accelZ: Number,
  tiltAngle: Number, // degrees
  totalAcceleration: Number, // magnitude used for threshold detection
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'severe'],
    default: 'moderate',
  },
  // Location at time of fall, captured from the last known GPS fix
  latitude: Number,
  longitude: Number,
  // Whether the wearer confirmed "I'm okay" or it escalated to an SOS
  status: {
    type: String,
    enum: ['detected', 'confirmed_false_alarm', 'sos_triggered', 'resolved'],
    default: 'detected',
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('FallEvent', fallEventSchema);