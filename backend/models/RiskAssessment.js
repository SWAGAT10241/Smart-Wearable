const mongoose = require("mongoose");
const crypto = require("crypto");

const riskAssessmentSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomUUID(),
    },
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
    riskLevel: {
      type: String,
      enum: ["normal", "low", "medium", "high", "critical"],
      default: "normal",
      index: true,
    },
    category: {
      type: String,
      enum: [
        "vitals_anomaly",
        "possible_fall",
        "environmental_hazard",
        "inactivity",
        "manual_concern",
      ],
      required: true,
    },
    confidenceScore: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.5,
    },
    isEmergencyConfirmed: {
      type: Boolean,
      default: false,
      index: true,
    },
    emergencySessionId: {
      type: String,
      trim: true,
      index: true,
    },
    sensorSnapshot: {
      heartRate: Number,
      spo2: Number,
      temperature: Number,
      altitude: Number,
      accelMagnitude: Number,
      tiltAngle: Number,
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Query optimization for device anomaly checks
riskAssessmentSchema.index({ deviceId: 1, evaluatedAt: -1 });

module.exports = mongoose.model("RiskAssessment", riskAssessmentSchema);
