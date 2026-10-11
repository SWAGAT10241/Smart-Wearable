const express = require("express");
const rateLimit = require("express-rate-limit");
const protect = require("../middleware/authMiddleware");
const { authorizePermission } = require("../middleware/authorizeRole");
const emergencySessionController = require("../controllers/emergencySessionController");

const router = express.Router();
const sessionRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/sessions",
  sessionRequestLimiter,
  protect,
  authorizePermission("emergency:session:create"),
  emergencySessionController.requestSession,
);
router.get(
  "/sessions/requests",
  protect,
  authorizePermission("emergency:session:assign"),
  emergencySessionController.listPendingSessions,
);
router.patch(
  "/sessions/:sessionId/assign",
  protect,
  authorizePermission("emergency:session:assign"),
  emergencySessionController.assignSession,
);
router.get(
  "/sessions/:sessionId/audit",
  protect,
  authorizePermission("emergency:session:audit"),
  emergencySessionController.getSessionAudit,
);
router.get(
  "/sessions/:sessionId/data",
  protect,
  authorizePermission("emergency:session:read"),
  emergencySessionController.getEmergencyData,
);
router.patch(
  "/sessions/:sessionId/close",
  protect,
  authorizePermission("emergency:session:close"),
  emergencySessionController.closeSession,
);

module.exports = router;
