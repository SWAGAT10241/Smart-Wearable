const express = require("express");
const protect = require("../middleware/authMiddleware");
const webSocketTicketService = require("../services/webSocketTicketService");
const emergencySessionController = require("../controllers/emergencySessionController");

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

  router.post("/sessions", protect, emergencySessionController.createSession);
  router.get("/sessions/active", protect, emergencySessionController.getActiveSessions);
  router.get(
    "/sessions/:sessionId/audit",
    protect,
    emergencySessionController.getSessionAudit,
  );
  router.get(
    "/sessions/:sessionId/historical",
    protect,
    emergencySessionController.getHistoricalData,
  );
  router.get("/sessions/:sessionId", protect, emergencySessionController.getSessionById);
  router.patch(
    "/sessions/:sessionId/status",
    protect,
    emergencySessionController.updateSessionStatus,
  );
  router.post(
    "/sessions/:sessionId/location",
    protect,
    emergencySessionController.updateSessionLocation,
  );
  router.post(
    "/sessions/:sessionId/risk",
    protect,
    emergencySessionController.updateSessionRisk,
  );
  router.post(
    "/sessions/:sessionId/responders",
    protect,
    emergencySessionController.assignOrJoinResponder,
  );

  return router;
}

module.exports = emergencyRoutes;
