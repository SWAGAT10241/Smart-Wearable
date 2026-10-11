const mongoose = require("mongoose");

const securityAuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "emergency.session.requested",
        "emergency.session.assigned",
        "emergency.session.data_accessed",
        "emergency.session.closed",
      ],
      immutable: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmergencySession",
      required: true,
      immutable: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      immutable: true,
    },
    windowStart: {
      type: Date,
      immutable: true,
    },
    windowEnd: {
      type: Date,
      immutable: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

securityAuditLogSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model("SecurityAuditLog", securityAuditLogSchema);
