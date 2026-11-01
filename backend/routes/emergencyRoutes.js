const express = require("express");
const protect = require("../middleware/authMiddleware");
const { authorizePermission } = require("../middleware/authorizeRole");
const emergencySessionController = require("../controllers/emergencySessionController");

function emergencyRoutes() {
  const router = express.Router();

  // POST /api/emergency/ws-ticket — Single-use authenticated WebSocket connection ticket
  router.post(
    "/ws-ticket",
    protect,
    authorizePermission("ws:ticket"),
    emergencySessionController.generateWsTicket,
  );

  // POST /api/emergency/sessions — Initiate/create an emergency session
  router.post(
    "/sessions",
    protect,
    authorizePermission("emergency:create"),
    emergencySessionController.createSession,
  );

  // GET /api/emergency/sessions/active — List active emergency sessions
  router.get(
    "/sessions/active",
    protect,
    emergencySessionController.getActiveSessions,
  );

  // GET /api/emergency/sessions/:sessionId — View specific emergency session
  router.get(
    "/sessions/:sessionId",
    protect,
    emergencySessionController.getSessionById,
  );

  // PATCH /api/emergency/sessions/:sessionId/status — Update status (escalate, resolve, cancel)
  router.patch(
    "/sessions/:sessionId/status",
    protect,
    emergencySessionController.updateSessionStatus,
  );

  // POST /api/emergency/sessions/:sessionId/location — Real-time location update during emergency
  router.post(
    "/sessions/:sessionId/location",
    protect,
    emergencySessionController.updateSessionLocation,
  );

  // POST /api/emergency/sessions/:sessionId/risk — Real-time risk update during emergency
  router.post(
    "/sessions/:sessionId/risk",
    protect,
    emergencySessionController.updateSessionRisk,
  );

  // POST /api/emergency/sessions/:sessionId/responders — Assign responder or self-join
  router.post(
    "/sessions/:sessionId/responders",
    protect,
    emergencySessionController.assignOrJoinResponder,
  );

  // GET /api/emergency/sessions/:sessionId/audit — Session audit trail (coordinators/admins)
  router.get(
    "/sessions/:sessionId/audit",
    protect,
    authorizePermission("emergency:audit:read"),
    emergencySessionController.getSessionAudit,
  );

  // GET /api/emergency/sessions/:sessionId/historical — Controlled 6h historical replay
  router.get(
    "/sessions/:sessionId/historical",
    protect,
    emergencySessionController.getHistoricalData,
  );

  return router;
}

module.exports = emergencyRoutes;
