const { WebSocketServer } = require("ws");
const logger = require("../utils/logger");

const clients = new Set();

/**
 * Broadcast an event payload to all connected WebSocket clients.
 * Safely ignores clients that are closed or encounter socket transmission errors.
 *
 * @param {object} message - Message payload to broadcast
 */
function broadcast(message) {
  const payload = JSON.stringify(message);

  clients.forEach((client) => {
    try {
      if (client && client.readyState === client.OPEN) {
        client.send(payload);
      }
    } catch (error) {
      logger.error("WebSocket broadcast error:", error.message);
    }
  });
}

/**
 * Initialize WebSocketServer on an HTTP server instance.
 *
 * @param {import("http").Server} server - Node HTTP server instance
 * @returns {WebSocketServer}
 */
function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/live" });

  wss.on("connection", (ws) => {
    clients.add(ws);
    logger.info(`Dashboard client connected. Total clients: ${clients.size}`);

    ws.on("close", () => {
      clients.delete(ws);
      logger.info(`Dashboard client disconnected. Total clients: ${clients.size}`);
    });

    ws.on("error", (error) => {
      clients.delete(ws);
      logger.warn("WebSocket client error:", error?.message || error);
    });
  });

  return wss;
}

module.exports = {
  clients,
  broadcast,
  initWebSocket,
};
