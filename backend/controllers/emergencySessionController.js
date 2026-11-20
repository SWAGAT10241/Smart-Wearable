const emergencySessionService = require("../services/emergencySessionService");
const webSocketTicketService = require("../services/webSocketTicketService");
const asyncHandler = require("../utils/asyncHandler");

function extractMeta(req) {
  return {
    ipAddress: req.ip || req.connection?.remoteAddress || "",
    userAgent: req.get("User-Agent") || "",
  };
}

/**
 * Generate a single-use WebSocket authentication ticket.
 */
const generateWsTicket = asyncHandler(async (req, res) => {
  const result = await webSocketTicketService.createTicket(req.userId, req.user?.role);
  res.status(201).json(result);
});

/**
 * Trigger/create a new emergency session.
 */
const createSession = asyncHandler(async (req, res) => {
  const session = await emergencySessionService.createSession(
    req.body,
    req.user,
    extractMeta(req),
  );
  res.status(201).json({
    message: "Emergency session initiated",
    session,
  });
});

/**
 * List active emergency sessions.
 */
const getActiveSessions = asyncHandler(async (req, res) => {
  const sessions = await emergencySessionService.getActiveSessions(req.user);
  res.json({ sessions });
});

/**
 * Get details of a single emergency session.
 */
const getSessionById = asyncHandler(async (req, res) => {
  const session = await emergencySessionService.getSessionById(
    req.params.sessionId,
    req.user,
    extractMeta(req),
  );
  res.json({ session });
});

/**
 * Update emergency session status (escalate, resolve, cancel).
 */
const updateSessionStatus = asyncHandler(async (req, res) => {
  const session = await emergencySessionService.updateSessionStatus(
    req.params.sessionId,
    req.body,
    req.user,
    extractMeta(req),
  );
  res.json({
    message: `Emergency session status updated to ${session.status}`,
    session,
  });
});

/**
 * Update current emergency location.
 */
const updateSessionLocation = asyncHandler(async (req, res) => {
  const location = await emergencySessionService.updateSessionLocation(
    req.params.sessionId,
    req.body,
    req.user,
    extractMeta(req),
  );
  res.json({
    message: "Emergency location updated",
    location,
  });
});

/**
 * Update current emergency risk assessment.
 */
const updateSessionRisk = asyncHandler(async (req, res) => {
  const risk = await emergencySessionService.updateSessionRisk(
    req.params.sessionId,
    req.body,
    req.user,
    extractMeta(req),
  );
  res.status(201).json({
    message: "Emergency risk assessment updated",
    risk,
  });
});

/**
 * Assign responder or join emergency session.
 */
const assignOrJoinResponder = asyncHandler(async (req, res) => {
  const session = await emergencySessionService.assignOrJoinResponder(
    req.params.sessionId,
    req.body,
    req.user,
    extractMeta(req),
  );
  res.json({
    message: "Responder updated for emergency session",
    session,
  });
});

/**
 * Get audit trail for emergency session.
 */
const getSessionAudit = asyncHandler(async (req, res) => {
  const auditEntries = await emergencySessionService.getSessionAudit(
    req.params.sessionId,
    req.user,
  );
  res.json({ audit: auditEntries });
});

/**
 * Get controlled 6-hour historical telemetry.
 */
const getHistoricalData = asyncHandler(async (req, res) => {
  const data = await emergencySessionService.getHistoricalData(
    req.params.sessionId,
    req.user,
    extractMeta(req),
  );
  res.json(data);
});

module.exports = {
  generateWsTicket,
  createSession,
  getActiveSessions,
  getSessionById,
  updateSessionStatus,
  updateSessionLocation,
  updateSessionRisk,
  assignOrJoinResponder,
  getSessionAudit,
  getHistoricalData,
};
