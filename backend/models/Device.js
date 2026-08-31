const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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