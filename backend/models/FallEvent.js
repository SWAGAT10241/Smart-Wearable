const mongoose = require("mongoose");

const fallEventSchema = new mongoose.Schema(
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
    accelX: Number,
    accelY: Number,
    accelZ: Number,
    tiltAngle: {
      type: Number,
      min: 0,
    },
    totalAcceleration: {
      type: Number,
      min: 0,
    },
    severity: {
      type: String,
      enum: ["minor", "moderate", "severe"],
      default: "moderate",
    },
    latitude: Number,
    longitude: Number,
    status: {
      type: String,
      enum: ["detected", "confirmed_false_alarm", "sos_triggered", "resolved"],
      default: "detected",
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

// Fast fall-history queries
fallEventSchema.index({deviceId: 1,timestamp: -1,});

module.exports = mongoose.model("FallEvent", fallEventSchema);
