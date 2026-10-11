const { WebSocketServer } = require("ws");
const config = require("../config/env");
const webSocketTicketService = require("../services/webSocketTicketService");
const logger = require("../utils/logger");

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

function sanitizeMessage(message) {
  if (
    !message ||
    typeof message !== "object" ||
    typeof message.userId !== "string" ||
    !Object.hasOwn(EVENT_FIELDS, message.type)
  ) {
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
 * Send each live event only to the authenticated owner of its source data.
 */
function broadcast(message) {
  const safeMessage = sanitizeMessage(message);
  if (!safeMessage) {
    logger.warn("websocket.broadcast_rejected");
    return;
  }
  const payload = JSON.stringify(safeMessage);

  clients.forEach((client) => {
    if (client.userId !== message.userId) return;
    try {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    } catch (error) {
      logger.error("websocket.broadcast_failed", { error });
    }
  });
}

function rejectUpgrade(socket, statusCode, statusText) {
  socket.write(
    `HTTP/1.1 ${statusCode} ${statusText}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
  );
  socket.destroy();
}

/**
 * Initialize an authenticated, single-use-ticket WebSocket endpoint.
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

    if (requestUrl.pathname !== "/live") return;

    const origin = request.headers.origin;
    if (origin && !config.clientUrls.includes(origin)) {
      rejectUpgrade(socket, 403, "Forbidden");
      return;
    }

    const offeredProtocols = (request.headers["sec-websocket-protocol"] || "")
      .split(",")
      .map((protocol) => protocol.trim());
    const ticketProtocol = offeredProtocols.find((protocol) =>
      protocol.startsWith("ticket."),
    );
    if (!offeredProtocols.includes("trailguard") || !ticketProtocol) {
      rejectUpgrade(socket, 401, "Unauthorized");
      return;
    }

    let userId;
    try {
      userId = await webSocketTicketService.consumeTicket(ticketProtocol.slice(7));
    } catch (error) {
      logger.error("websocket.ticket_validation_failed", { error });
      rejectUpgrade(socket, 503, "Service Unavailable");
      return;
    }
    if (!userId) {
      rejectUpgrade(socket, 401, "Unauthorized");
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = userId;
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    clients.add(ws);
    logger.info("websocket.client_connected", { count: clients.size });

    ws.on("close", () => {
      clients.delete(ws);
      logger.info("websocket.client_disconnected", { count: clients.size });
    });

    ws.on("error", (error) => {
      clients.delete(ws);
      logger.warn("websocket.client_error", { error });
    });
  });

  return wss;
}

module.exports = {
  clients,
  broadcast,
  initWebSocket,
  sanitizeMessage,
};
