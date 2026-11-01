const mongoose = require("mongoose");
const crypto = require("crypto");

const emergencySessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomUUID(),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    triggerType: {
      type: String,
      enum: ["manual_sos", "fall_confirmed", "vitals_critical", "panic_button"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "escalated", "resolved", "cancelled", "expired"],
      default: "active",
      index: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      accuracy: Number,
      altitude: Number,
      recordedAt: { type: Date, default: Date.now },
    },
    vitalsSummary: {
      heartRate: Number,
      spo2: Number,
      temperature: Number,
      batteryLevel: Number,
    },
    historicalWindowStart: {
      type: Date,
      description: "Anchor date 6 hours prior to trigger for authorized telemetry replay",
    },
    activeResponders: [
      {
        responderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: { type: Date, default: Date.now },
        accessExpiresAt: Date,
      },
    ],
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolutionNote: String,
    // Ephemeral data retention: automatic MongoDB cleanup via TTL index
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48-hour default retention after creation
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// TTL index to automatically purge expired emergency session records
emergencySessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound indexes for emergency querying
emergencySessionSchema.index({ status: 1, createdAt: -1 });
emergencySessionSchema.index({ userId: 1, status: 1 });
emergencySessionSchema.index({ deviceId: 1, status: 1 });

module.exports = mongoose.model("EmergencySession", emergencySessionSchema);
