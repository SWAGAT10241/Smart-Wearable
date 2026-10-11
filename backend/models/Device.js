const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    // Permanent identity programmed into the physical hardware.
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      immutable: true,
      index: true,
    },
    // User-facing name. The frontend can change this.
    deviceName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
      default: "TrailGuard Wearable",
    },
    state: {
      type: String,
      enum: ["UNREGISTERED", "PROVISIONED", "PAIRED", "REVOKED"],
      default: "UNREGISTERED",
      index: true,
    },
    publicKey: {
      type: String,
      select: false,
    },
    keyVersion: {
      type: Number,
      min: 1,
      default: 1,
    },
    bootstrapTokenHash: {
      type: String,
      select: false,
    },
    bootstrapTokenExpiresAt: {
      type: Date,
      select: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
      index: true,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

deviceSchema.index({ userId: 1, status: 1 });
module.exports = mongoose.model("Device", deviceSchema);
