const mongoose = require('mongoose');

const locationReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    altitude: {
      type: Number,
    },
    satellites: {
      type: Number,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

// Fast trail/latest-location queries
locationReadingSchema.index({
  deviceId: 1,
  timestamp: -1,
});

module.exports = mongoose.model(
  'LocationReading',
  locationReadingSchema
);