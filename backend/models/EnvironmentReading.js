const mongoose = require("mongoose");

const environmentReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    pressure: {
      type: Number,
      required: true,
      min: 900,
      max: 1100,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  },
);

// Fast history/latest queries
environmentReadingSchema.index({ deviceId: 1, timestamp: -1 });
module.exports = mongoose.model("EnvironmentReading", environmentReadingSchema);