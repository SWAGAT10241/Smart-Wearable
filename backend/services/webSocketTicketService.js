const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const WebSocketTicket = require("../models/WebSocketTicket");
const config = require("../config/env");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

const TICKET_TTL_SECONDS = 30;

async function issueTicket(userId) {
  const jti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + TICKET_TTL_SECONDS * 1000);
  const ticket = jwt.sign(
    { sub: String(userId), purpose: "websocket", jti },
    config.jwtSecret,
    { expiresIn: TICKET_TTL_SECONDS, algorithm: "HS256" },
  );
  await WebSocketTicket.create({ jti, userId, expiresAt });
  return ticket;
}

async function consumeTicket(ticket) {
  if (typeof ticket !== "string" || ticket.length > 2048) return null;

  let decoded;
  try {
    decoded = jwt.verify(ticket, config.jwtSecret, { algorithms: ["HS256"] });
  } catch {
    return null;
  }
  if (
    decoded.purpose !== "websocket" ||
    typeof decoded.sub !== "string" ||
    typeof decoded.jti !== "string"
  ) {
    return null;
  }

  try {
    const record = await WebSocketTicket.findOneAndDelete({
      jti: decoded.jti,
      userId: decoded.sub,
      expiresAt: { $gt: new Date() },
    });
    return record ? decoded.sub : null;
  } catch (error) {
    logger.error("websocket.ticket.consume_failed", { error });
    throw new AppError("WebSocket authorization is temporarily unavailable", 503, "WS_AUTH_UNAVAILABLE");
  }
}

module.exports = {
  TICKET_TTL_SECONDS,
  issueTicket,
  consumeTicket,
};
