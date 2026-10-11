const { WebSocketServer } = require("ws");

const clients = new Set();

/**
 * Initialize WebSocket server bound to HTTP server.
 *
 * @param {import("http").Server} server
 * @returns {WebSocketServer}
 */
function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/live" });

  wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("close", () => {
      clients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket client error:", error.message);
      clients.delete(ws);
    });
  });

  return wss;
}

/**
 * Broadcast JSON payload to all connected WebSocket clients.
 *
 * @param {object} message
 */
function broadcast(message) {
  const payload = JSON.stringify(message);
  clients.forEach((client) => {
    try {
      if (client && client.readyState === client.OPEN) {
        client.send(payload);
      }
    } catch (error) {
      console.error("WebSocket broadcast error:", error.message);
    }
  });
}

module.exports = {
  clients,
  broadcast,
  initWebSocket,
};
