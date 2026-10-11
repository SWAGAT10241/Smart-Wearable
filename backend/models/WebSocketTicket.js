const mongoose = require("mongoose");

const webSocketTicketSchema = new mongoose.Schema(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("WebSocketTicket", webSocketTicketSchema);
