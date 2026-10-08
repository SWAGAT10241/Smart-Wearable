const mongoose = require("mongoose");

const devicePairingSchema = new mongoose.Schema(
  {
    challengeId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    deviceId: {
      type: String,
      required: true,
      immutable: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },
    bootstrapTokenHash: {
      type: String,
      required: true,
      select: false,
    },
    nonceHash: {
      type: String,
      required: true,
      select: false,
    },
    state: {
      type: String,
      enum: ["PENDING", "CONSUMED", "FAILED", "EXPIRED"],
      default: "PENDING",
      required: true,
    },
    attempts: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    purgeAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    consumedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

devicePairingSchema.index({ deviceId: 1, userId: 1, state: 1 });
module.exports = mongoose.model("DevicePairing", devicePairingSchema);
