const mongoose = require("mongoose");
const crypto = require("crypto");

const webSocketTicketSchema = new mongoose.Schema(
  {
    ticket: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["citizen", "responder", "coordinator", "admin"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 60 * 1000), // 60-second single-use TTL
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// TTL index to automatically purge expired tickets
webSocketTicketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("WebSocketTicket", webSocketTicketSchema);
