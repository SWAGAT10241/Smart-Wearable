const mongoose = require("mongoose");
const crypto = require("crypto");

const auditLogSchema = new mongoose.Schema(
  {
    auditId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomUUID(),
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      enum: ["citizen", "responder", "coordinator", "admin", "system"],
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "EMERGENCY_SESSION_ACCESSED",
        "HISTORICAL_VITALS_REQUESTED",
        "DEVICE_PAIRING_INITIATED",
        "DEVICE_CLAIMED",
        "DEVICE_REVOKED",
        "EMERGENCY_STATUS_UPDATED",
        "EMERGENCY_SESSION_RESOLVED",
        "USER_ROLE_UPDATED",
      ],
      required: true,
      index: true,
    },
    targetResource: {
      type: String,
      required: true,
      index: true, // Format: "EmergencySession:<sessionId>" or "Device:<deviceId>"
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
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

// Fast security audits and chronological investigations
auditLogSchema.index({ targetResource: 1, timestamp: -1 });
auditLogSchema.index({ actorId: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
