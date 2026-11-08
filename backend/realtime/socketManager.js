const { WebSocketServer } = require("ws");
const webSocketTicketService = require("../services/webSocketTicketService");

const clients = new Set();

/**
 * Initialize WebSocket server bound to HTTP server.
 *
 * @param {import("http").Server} server
 * @returns {WebSocketServer}
 */
function initWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: "/live",
    handleProtocols: (protocols) => {
      if (protocols.has("trailguard")) {
        return "trailguard";
      }
      return false;
    },
  });

  wss.on("connection", async (ws, request) => {
    // Validate ticket subprotocol if offered
    const offeredProtocols = (request.headers["sec-websocket-protocol"] || "")
      .split(",")
      .map((p) => p.trim());
    const ticketProtocol = offeredProtocols.find((p) => p.startsWith("ticket."));

    if (ticketProtocol) {
      const ticketString = ticketProtocol.slice(7);
      try {
        const auth = await webSocketTicketService.consumeTicket(ticketString);
        if (!auth) {
          ws.close(4001, "Invalid or expired ticket");
          return;
        }
        ws.userId = auth.userId;
        ws.role = auth.role;
      } catch (err) {
        console.error("Error validating WebSocket ticket:", err.message);
        ws.close(4001, "Authentication error");
        return;
      }
    }

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
