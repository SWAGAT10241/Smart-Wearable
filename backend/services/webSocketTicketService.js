const crypto = require("crypto");
const WebSocketTicket = require("../models/WebSocketTicket");
const User = require("../models/User");

/**
 * Generate a single-use WebSocket ticket for an authenticated user.
 *
 * @param {string|import("mongoose").Types.ObjectId} userId
 * @param {string} [role]
 * @returns {Promise<{ ticket: string, expiresIn: number }>}
 */
async function createTicket(userId, role) {
  let resolvedRole = role;
  if (!resolvedRole) {
    const user = await User.findById(userId).select("role");
    resolvedRole = user?.role || "citizen";
  }

  const ticketString = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 1000);

  const doc = await WebSocketTicket.create({
    ticket: ticketString,
    userId,
    role: resolvedRole,
    expiresAt,
  });

  return {
    ticket: doc.ticket,
    expiresIn: 60,
  };
}

/**
 * Consume a single-use WebSocket ticket during handshake.
 *
 * @param {string} ticketString
 * @returns {Promise<{ userId: string, role: string } | null>}
 */
async function consumeTicket(ticketString) {
  if (typeof ticketString !== "string" || !ticketString.trim()) {
    return null;
  }

  const ticketDoc = await WebSocketTicket.findOneAndDelete({
    ticket: ticketString.trim(),
    expiresAt: { $gt: new Date() },
  });

  if (!ticketDoc) {
    return null;
  }

  return {
    userId: String(ticketDoc.userId),
    role: ticketDoc.role,
  };
}

module.exports = {
  createTicket,
  consumeTicket,
};
