const emergencySessionService = require("../services/emergencySessionService");
const asyncHandler = require("../utils/asyncHandler");

const requestSession = asyncHandler(async (req, res) => {
  const session = await emergencySessionService.requestSession(
    req.userId,
    req.body?.deviceId,
  );
  res.status(201).json({ session });
});

const assignSession = asyncHandler(async (req, res) => {
  const session = await emergencySessionService.assignSession(
    req.userId,
    req.params.sessionId,
    req.body?.responderId,
  );
  res.json({ session });
});

const listPendingSessions = asyncHandler(async (req, res) => {
  const sessions = await emergencySessionService.listPendingSessions();
  res.json({ sessions });
});

const getSessionAudit = asyncHandler(async (req, res) => {
  const audit = await emergencySessionService.getSessionAudit(
    req.params.sessionId,
  );
  res.json({ audit });
});

const getEmergencyData = asyncHandler(async (req, res) => {
  const result = await emergencySessionService.getEmergencyData(
    req.userId,
    req.params.sessionId,
    req.user?.role,
  );
  res.json(result);
});

const closeSession = asyncHandler(async (req, res) => {
  const session = await emergencySessionService.closeSession(
    req.userId,
    req.user?.role,
    req.params.sessionId,
  );
  res.json({ session });
});

module.exports = {
  requestSession,
  assignSession,
  listPendingSessions,
  getSessionAudit,
  getEmergencyData,
  closeSession,
};
