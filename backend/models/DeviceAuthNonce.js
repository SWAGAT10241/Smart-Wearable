const mongoose = require("mongoose");

const deviceAuthNonceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    nonceHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  },
);

deviceAuthNonceSchema.index({ deviceId: 1, nonceHash: 1 }, { unique: true });

module.exports = mongoose.model("DeviceAuthNonce", deviceAuthNonceSchema);
