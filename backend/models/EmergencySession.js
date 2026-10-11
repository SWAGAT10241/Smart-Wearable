const mongoose = require("mongoose");

const emergencySessionSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      immutable: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["REQUESTED", "ACTIVE", "CLOSED"],
      default: "REQUESTED",
      index: true,
    },
    assignedResponderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    authorizedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    activatedAt: Date,
    closedAt: Date,
    closedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

emergencySessionSchema.index({ status: 1, createdAt: 1 });
emergencySessionSchema.index({ assignedResponderId: 1, status: 1 });

module.exports = mongoose.model("EmergencySession", emergencySessionSchema);
