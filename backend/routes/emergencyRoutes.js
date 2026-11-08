const express = require("express");
const protect = require("../middleware/authMiddleware");
const webSocketTicketService = require("../services/webSocketTicketService");

function emergencyRoutes() {
  const router = express.Router();

  // POST /api/emergency/ws-ticket — Single-use authenticated WebSocket connection ticket
  router.post("/ws-ticket", protect, async (req, res, next) => {
    try {
      const result = await webSocketTicketService.createTicket(
        req.userId,
        req.user?.role || "citizen",
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = emergencyRoutes;
