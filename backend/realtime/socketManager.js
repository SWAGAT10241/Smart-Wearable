const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const logger = require("../utils/logger");
const webSocketTicketService = require("../services/webSocketTicketService");
const EmergencySession = require("../models/EmergencySession");

const clients = new Set();

const EVENT_FIELDS = {
  vitals: ["heartRate", "spo2", "timestamp"],
  environment: ["temperature", "humidity", "pressure", "timestamp"],
  location: ["latitude", "longitude", "altitude", "satellites", "timestamp"],
  fall_detected: [
    "_id",
    "severity",
    "status",
    "timestamp",
    "latitude",
    "longitude",
    "tiltAngle",
    "totalAcceleration",
  ],
  fall_status_update: [
    "_id",
    "severity",
    "status",
    "timestamp",
    "latitude",
    "longitude",
    "tiltAngle",
    "totalAcceleration",
  ],
};

/**
 * Filter telemetry message to allowed fields.
 */
function sanitizeMessage(message) {
  if (!message || typeof message !== "object") {
    return null;
  }

  if (message.sessionId) {
    return message;
  }

  if (!Object.hasOwn(EVENT_FIELDS, message.type)) {
    return null;
  }

  const data = {};
  for (const field of EVENT_FIELDS[message.type]) {
    const value = message.data?.[field];
    if (value !== undefined) data[field] = value;
  }

  return {
    type: message.type,
    ...(typeof message.deviceId === "string" ? { deviceId: message.deviceId } : {}),
    data,
  };
}

/**
 * Check if a connected user is authorized to subscribe to an emergency session.
 *
 * @param {string} userId - Authenticated user ID
 * @param {string} role - Authenticated user role
 * @param {string} sessionId - Target emergency session UUID
 * @returns {Promise<boolean>}
 */
async function authorizeSessionSubscription(userId, role, sessionId) {
  if (!sessionId || typeof sessionId !== "string") {
    return false;
  }

  if (role === "admin" || role === "coordinator") {
    return true;
  }

  try {
    const session = await EmergencySession.findOne({ sessionId: sessionId.trim() }).select(
      "userId activeResponders status",
    );

    if (!session) {
      return false;
    }

    // Citizen owner
    if (session.userId && String(session.userId) === String(userId)) {
      return true;
    }

    // Assigned active responder
    if (
      role === "responder" &&
      Array.isArray(session.activeResponders) &&
      session.activeResponders.some((r) => String(r.responderId) === String(userId))
    ) {
      return true;
    }

    return false;
  } catch (error) {
    logger.error("Session authorization check failed:", error.message);
    return false;
  }
}

/**
 * Broadcast an emergency event strictly to authorized session subscribers
 * and active coordinator/responder feed listeners.
 *
 * @param {string} sessionId - Ephemeral emergency session UUID
 * @param {string} eventType - Event type name
 * @param {object} data - Emergency event data
 */
function broadcastEmergencyEvent(sessionId, eventType, data) {
  const payload = JSON.stringify({
    type: eventType,
    sessionId,
    data,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    try {
      if (
        client &&
        client.readyState === client.OPEN &&
        (client.subscriptions?.has(sessionId) || client.subscribedToEmergencyFeed)
      ) {
        client.send(payload);
      }
    } catch (error) {
      logger.error("WebSocket emergency broadcast error:", error.message);
    }
  });
}

/**
 * Broadcast telemetry data ONLY to the authenticated owner of the device.
 *
 * @param {object} message - Telemetry message with userId
 */
function broadcastTelemetry(message) {
  const safeMessage = sanitizeMessage(message);
  if (!safeMessage) {
    return;
  }

  const payload = JSON.stringify(safeMessage);
  const targetUserId = message.userId ? String(message.userId) : null;

  if (!targetUserId) {
    logger.warn("Dropping telemetry broadcast without target userId");
    return;
  }

  clients.forEach((client) => {
    try {
      if (
        client &&
        client.readyState === client.OPEN &&
        String(client.userId) === targetUserId
      ) {
        client.send(payload);
      }
    } catch (error) {
      logger.error("WebSocket telemetry broadcast error:", error.message);
    }
  });
}

/**
 * Backward-compatible broadcast dispatcher.
 * Routes emergency session events to session subscribers,
 * and device telemetry strictly to the authenticated device owner.
 *
 * @param {object} message - Message payload to broadcast
 */
function broadcast(message) {
  if (!message || typeof message !== "object") {
    return;
  }

  if (message.sessionId) {
    broadcastEmergencyEvent(message.sessionId, message.type, message.data || message);
    return;
  }

  if (message.userId) {
    broadcastTelemetry(message);
    return;
  }

  logger.warn("WebSocket broadcast rejected: requires sessionId or target userId");
}

function rejectUpgrade(socket, statusCode, statusText) {
  socket.write(
    `HTTP/1.1 ${statusCode} ${statusText}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
  );
  socket.destroy();
}

/**
 * Initialize authenticated, session-scoped WebSocket server on an HTTP server instance.
 *
 * @param {import("http").Server} server - Node HTTP server instance
 * @returns {WebSocketServer}
 */
function initWebSocket(server) {
  const wss = new WebSocketServer({
    noServer: true,
    handleProtocols: (protocols) => (protocols.has("trailguard") ? "trailguard" : false),
  });

  server.on("upgrade", async (request, socket, head) => {
    let requestUrl;
    try {
      requestUrl = new URL(request.url, "http://localhost");
    } catch {
      rejectUpgrade(socket, 400, "Bad Request");
      return;
    }

    if (requestUrl.pathname !== "/live") {
      return;
    }

    const origin = request.headers.origin;
    if (origin && config.clientUrls.length > 0 && !config.clientUrls.includes(origin)) {
      rejectUpgrade(socket, 403, "Forbidden");
      return;
    }

    // Extract authentication credentials
    let authIdentity = null;

    // 1. Check Sec-WebSocket-Protocol for ticket.<ticketString>
    const offeredProtocols = (request.headers["sec-websocket-protocol"] || "")
      .split(",")
      .map((p) => p.trim());
    const ticketProtocol = offeredProtocols.find((p) => p.startsWith("ticket."));

    if (ticketProtocol) {
      const ticketString = ticketProtocol.slice(7);
      try {
        authIdentity = await webSocketTicketService.consumeTicket(ticketString);
      } catch (err) {
        logger.error("Error consuming WebSocket ticket:", err.message);
      }
    }

    // Non-browser clients may authenticate via the Authorization header.
    if (!authIdentity) {
      const headerToken = request.headers.authorization?.startsWith("Bearer ")
        ? request.headers.authorization.slice(7)
        : null;

      if (headerToken && config.jwtSecret) {
        try {
          const decoded = jwt.verify(headerToken, config.jwtSecret);
          if (decoded && decoded.id) {
            authIdentity = {
              userId: String(decoded.id),
              role: decoded.role || "citizen",
            };
          }
        } catch {
          // Token verification failed
        }
      }
    }

    if (!authIdentity) {
      rejectUpgrade(socket, 401, "Unauthorized");
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = authIdentity.userId;
      ws.role = authIdentity.role;
      ws.subscriptions = new Set();
      ws.subscribedToEmergencyFeed = false;
      ws.isAlive = true;

      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    clients.add(ws);
    logger.info(`WebSocket client connected (User: ${ws.userId}, Role: ${ws.role}). Total: ${clients.size}`);

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", async (rawMessage) => {
      let message;
      try {
        message = JSON.parse(rawMessage.toString());
      } catch {
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
        return;
      }

      if (!message || typeof message !== "object") {
        return;
      }

      // Handle Ping
      if (message.action === "ping") {
        ws.send(JSON.stringify({ type: "pong", timestamp: new Date().toISOString() }));
        return;
      }

      // Handle Emergency Session Subscription
      if (message.action === "subscribe") {
        const { sessionId } = message;
        if (!sessionId || typeof sessionId !== "string") {
          ws.send(JSON.stringify({ type: "error", message: "sessionId is required" }));
          return;
        }

        const authorized = await authorizeSessionSubscription(ws.userId, ws.role, sessionId);
        if (!authorized) {
          ws.send(
            JSON.stringify({
              type: "error",
              code: "FORBIDDEN",
              message: "Unauthorized to subscribe to emergency session",
              sessionId,
            }),
          );
          return;
        }

        ws.subscriptions.add(sessionId);
        ws.send(JSON.stringify({ type: "subscribed", sessionId }));
        return;
      }

      // Handle Emergency Session Unsubscribe
      if (message.action === "unsubscribe") {
        const { sessionId } = message;
        if (sessionId) {
          ws.subscriptions.delete(sessionId);
          ws.send(JSON.stringify({ type: "unsubscribed", sessionId }));
        }
        return;
      }

      // Handle Emergency Feed Subscription (Coordinators/Responders/Admins)
      if (message.action === "subscribe_feed") {
        if (!["responder", "coordinator", "admin"].includes(ws.role)) {
          ws.send(
            JSON.stringify({
              type: "error",
              code: "FORBIDDEN",
              message: "Emergency feed subscription requires responder or coordinator role",
            }),
          );
          return;
        }

        ws.subscribedToEmergencyFeed = true;
        ws.send(JSON.stringify({ type: "subscribed_feed" }));
        return;
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      logger.info(`WebSocket client disconnected. Total: ${clients.size}`);
    });

    ws.on("error", (error) => {
      clients.delete(ws);
      logger.warn("WebSocket client error:", error?.message || error);
    });
  });

  // Heartbeat interval to detect stale connections
  let heartbeatInterval = null;
  if (!config.isTest) {
    heartbeatInterval = setInterval(() => {
      wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          clients.delete(ws);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  wss.on("close", () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
  });

  return wss;
}

module.exports = {
  clients,
  broadcast,
  broadcastEmergencyEvent,
  broadcastTelemetry,
  initWebSocket,
  sanitizeMessage,
  authorizeSessionSubscription,
};
