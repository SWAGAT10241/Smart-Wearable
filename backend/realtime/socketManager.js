const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const webSocketTicketService = require("../services/webSocketTicketService");
const EmergencySession = require("../models/EmergencySession");

const clients = new Set();

/**
 * Authorize whether a user has permission to subscribe to a specific emergency session.
 *
 * @param {string} userId
 * @param {string} role
 * @param {string} sessionId
 * @returns {Promise<boolean>}
 */
async function authorizeSessionSubscription(userId, role, sessionId) {
  if (role === "admin" || role === "coordinator") {
    return true;
  }

  if (!sessionId || typeof sessionId !== "string") {
    return false;
  }

  try {
    const session = await EmergencySession.findOne({ sessionId }).select("userId activeResponders status");
    if (!session) {
      return false;
    }

    if (role === "citizen") {
      return session.userId === userId;
    }

    if (role === "responder") {
      return (
        Array.isArray(session.activeResponders) &&
        session.activeResponders.some((r) => r.responderId === userId)
      );
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Broadcast an emergency event strictly to clients subscribed to that sessionId
 * or registered to the global rescue emergency feed.
 *
 * @param {string} sessionId
 * @param {string} type
 * @param {object} data
 */
function broadcastEmergencyEvent(sessionId, type, data) {
  const payload = JSON.stringify({ type, sessionId, data });

  for (const client of clients) {
    try {
      if (client && client.readyState === client.OPEN) {
        const isSubscribedToSession = client.subscriptions && client.subscriptions.has(sessionId);
        const isEmergencyFeedListener = Boolean(client.subscribedToEmergencyFeed);

        if (isSubscribedToSession || isEmergencyFeedListener) {
          client.send(payload);
        }
      }
    } catch (error) {
      // client send error handled silently
    }
  }
}

/**
 * Broadcast telemetry strictly to the authenticated device owner.
 *
 * @param {object} param0
 * @param {string} param0.type
 * @param {string} param0.userId
 * @param {string} param0.deviceId
 * @param {object} param0.data
 */
function broadcastTelemetry({ type, userId, deviceId, data }) {
  const cleanData = {};
  if (data && typeof data === "object") {
    for (const [key, value] of Object.entries(data)) {
      if (key !== "secretInternalField" && !key.startsWith("_")) {
        cleanData[key] = value;
      }
    }
  }

  const payload = JSON.stringify({ type, deviceId, data: cleanData });

  for (const client of clients) {
    try {
      if (client && client.readyState === client.OPEN && client.userId === userId) {
        client.send(payload);
      }
    } catch (error) {
      // client send error handled silently
    }
  }
}

/**
 * Legacy broadcast to all connected clients (kept for backwards compatibility).
 *
 * @param {object} message
 */
function broadcast(message) {
  const payload = JSON.stringify(message);
  for (const client of clients) {
    try {
      if (client && client.readyState === client.OPEN) {
        client.send(payload);
      }
    } catch (error) {
      // client send error handled silently
    }
  }
}

/**
 * Initialize WebSocket server bound to HTTP server with strict single-use ticket
 * and Bearer token upgrade authentication.
 *
 * @param {import("http").Server} server
 * @returns {WebSocketServer}
 */
function initWebSocket(server) {
  const wss = new WebSocketServer({
    noServer: true,
  });

  server.on("upgrade", async (request, socket, head) => {
    const rawUrl = request.url || "";
    const [pathname, search] = rawUrl.split("?");

    if (pathname !== "/live") {
      return;
    }

    // Prohibit credentials in query string to prevent access log leakage
    if (search) {
      const params = new URLSearchParams(search);
      if (params.has("ticket") || params.has("token")) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
    }

    let auth = null;

    // Check Sec-WebSocket-Protocol for single-use ticket
    const offeredProtocols = (request.headers["sec-websocket-protocol"] || "")
      .split(",")
      .map((p) => p.trim());
    const ticketProtocol = offeredProtocols.find((p) => p.startsWith("ticket."));

    if (ticketProtocol) {
      const ticketString = ticketProtocol.slice(7);
      try {
        auth = await webSocketTicketService.consumeTicket(ticketString);
      } catch (err) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      if (!auth) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
    } else if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer ")
    ) {
      const token = request.headers.authorization.slice(7).trim();
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        auth = { userId: decoded.id || decoded.userId, role: decoded.role };
      } catch (err) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
    }

    if (!auth) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = auth.userId;
      ws.role = auth.role;
      ws.subscriptions = new Set();
      ws.subscribedToEmergencyFeed = false;
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    ws.subscriptions = ws.subscriptions || new Set();
    clients.add(ws);

    ws.on("message", async (rawMessage) => {
      try {
        const msg = JSON.parse(rawMessage.toString());
        if (msg.action === "subscribe" && msg.sessionId) {
          const allowed = await authorizeSessionSubscription(ws.userId, ws.role, msg.sessionId);
          if (allowed) {
            ws.subscriptions.add(msg.sessionId);
            ws.send(JSON.stringify({ type: "subscribed", sessionId: msg.sessionId }));
          } else {
            ws.send(JSON.stringify({ type: "error", error: "Unauthorized session subscription" }));
          }
        } else if (msg.action === "unsubscribe" && msg.sessionId) {
          ws.subscriptions.delete(msg.sessionId);
          ws.send(JSON.stringify({ type: "unsubscribed", sessionId: msg.sessionId }));
        } else if (msg.action === "subscribe_feed") {
          if (["admin", "coordinator", "responder"].includes(ws.role)) {
            ws.subscribedToEmergencyFeed = true;
            ws.send(JSON.stringify({ type: "subscribed_feed" }));
          }
        }
      } catch (err) {
        // invalid JSON or malformed client frame ignored
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });

    ws.on("error", () => {
      clients.delete(ws);
    });
  });

  return wss;
}

module.exports = {
  clients,
  broadcast,
  broadcastEmergencyEvent,
  broadcastTelemetry,
  authorizeSessionSubscription,
  initWebSocket,
};
