const mongoose = require("mongoose");

const Device = require("../models/Device");
const EmergencySession = require("../models/EmergencySession");
const EnvironmentReading = require("../models/EnvironmentReading");
const FallEvent = require("../models/FallEvent");
const LocationReading = require("../models/LocationReading");
const SecurityAuditLog = require("../models/SecurityAuditLog");
const User = require("../models/User");
const VitalsReading = require("../models/VitalsReading");
const AppError = require("../utils/appError");

const EMERGENCY_HISTORY_HOURS = 6;
const MAX_READINGS_PER_KIND = 500;

function validateObjectId(value, name) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${name}`, 400, "VALIDATION_ERROR");
  }
}

function sameId(left, right) {
  return left != null && right != null && String(left) === String(right);
}

async function writeAudit({ action, actorId, session, windowStart, windowEnd }) {
  await SecurityAuditLog.create({
    action,
    actorId,
    targetUserId: session.requesterId,
    sessionId: session._id,
    deviceId: session.deviceId,
    ...(windowStart ? { windowStart } : {}),
    ...(windowEnd ? { windowEnd } : {}),
  });
}

async function requestSession(requesterId, deviceId) {
  if (typeof deviceId !== "string" || !deviceId.trim()) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }
  const normalizedDeviceId = deviceId.trim().toUpperCase();
  const device = await Device.findOne({
    deviceId: normalizedDeviceId,
    userId: requesterId,
    state: "PAIRED",
    status: "active",
  }).select("deviceId");
  if (!device) {
    throw new AppError("Active paired device not found", 404, "DEVICE_NOT_FOUND");
  }

  const session = await EmergencySession.create({
    requesterId,
    deviceId: normalizedDeviceId,
    status: "REQUESTED",
  });
  await writeAudit({
    action: "emergency.session.requested",
    actorId: requesterId,
    session,
  });
  return session;
}

async function assignSession(actorId, sessionId, responderId) {
  validateObjectId(sessionId, "sessionId");
  validateObjectId(responderId, "responderId");

  if (sameId(actorId, responderId)) {
    throw new AppError("A separate responder must be assigned", 400, "INVALID_ASSIGNMENT");
  }

  const [session, responder] = await Promise.all([
    EmergencySession.findOne({ _id: sessionId, status: "REQUESTED" }),
    User.findById(responderId).select("role"),
  ]);
  if (!session) {
    throw new AppError("Emergency request is not awaiting assignment", 409, "SESSION_NOT_ASSIGNABLE");
  }
  if (!responder || responder.role !== "responder") {
    throw new AppError("An active responder account is required", 400, "INVALID_RESPONDER");
  }

  const activeSession = await EmergencySession.findOneAndUpdate(
    { _id: sessionId, status: "REQUESTED" },
    {
      $set: {
        status: "ACTIVE",
        assignedResponderId: responderId,
        authorizedById: actorId,
        activatedAt: new Date(),
      },
    },
    { new: true, runValidators: true },
  );
  if (!activeSession) {
    throw new AppError("Emergency request is no longer awaiting assignment", 409, "SESSION_NOT_ASSIGNABLE");
  }

  await writeAudit({
    action: "emergency.session.assigned",
    actorId,
    session: activeSession,
  });
  return activeSession;
}

async function listPendingSessions() {
  const sessions = await EmergencySession.find({ status: "REQUESTED" })
    .select("_id requesterId deviceId createdAt")
    .sort({ createdAt: 1 })
    .limit(100)
    .lean();
  return sessions.map(({ _id, requesterId, deviceId, createdAt }) => ({
    sessionId: String(_id),
    requesterId: String(requesterId),
    deviceId,
    createdAt,
  }));
}

async function getSessionAudit(sessionId) {
  validateObjectId(sessionId, "sessionId");
  const session = await EmergencySession.findById(sessionId).select("_id");
  if (!session) {
    throw new AppError("Emergency session not found", 404, "SESSION_NOT_FOUND");
  }

  const entries = await SecurityAuditLog.find({ sessionId })
    .select("action actorId createdAt windowStart windowEnd")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  return entries.map((entry) => ({
    action: entry.action,
    actorId: String(entry.actorId),
    occurredAt: entry.createdAt,
    ...(entry.windowStart ? { windowStart: entry.windowStart } : {}),
    ...(entry.windowEnd ? { windowEnd: entry.windowEnd } : {}),
  }));
}

async function findAuthorizedActiveSession(actorId, sessionId) {
  validateObjectId(sessionId, "sessionId");
  const session = await EmergencySession.findOne({
    _id: sessionId,
    status: "ACTIVE",
  });
  if (!session) {
    throw new AppError("Active emergency session not found", 404, "SESSION_NOT_FOUND");
  }
  if (
    !sameId(actorId, session.assignedResponderId) &&
    !sameId(actorId, session.authorizedById)
  ) {
    throw new AppError("Access to this emergency session is forbidden", 403, "FORBIDDEN");
  }
  return session;
}

function projectReadings(readings, fields) {
  return readings.map((reading) =>
    Object.fromEntries(fields.map((field) => [field, reading[field]]).filter(([, value]) => value !== undefined)),
  );
}

async function getEmergencyData(actorId, sessionId, actorRole) {
  if (!["responder", "coordinator", "admin"].includes(actorRole)) {
    throw new AppError("Emergency responder authorization is required", 403, "FORBIDDEN");
  }
  const session = await findAuthorizedActiveSession(actorId, sessionId);
  const windowEnd = new Date();
  const windowStart = new Date(
    windowEnd.getTime() - EMERGENCY_HISTORY_HOURS * 60 * 60 * 1000,
  );

  // Audit before querying protected health/location collections; fail closed if it cannot be recorded.
  await writeAudit({
    action: "emergency.session.data_accessed",
    actorId,
    session,
    windowStart,
    windowEnd,
  });

  const query = {
    userId: session.requesterId,
    deviceId: session.deviceId,
    timestamp: { $gte: windowStart, $lte: windowEnd },
  };
  const [vitals, environment, locations, falls] = await Promise.all([
    VitalsReading.find(query)
      .select("heartRate spo2 timestamp")
      .sort({ timestamp: -1 })
      .limit(MAX_READINGS_PER_KIND)
      .lean(),
    EnvironmentReading.find(query)
      .select("temperature humidity pressure timestamp")
      .sort({ timestamp: -1 })
      .limit(MAX_READINGS_PER_KIND)
      .lean(),
    LocationReading.find(query)
      .select("latitude longitude timestamp")
      .sort({ timestamp: -1 })
      .limit(MAX_READINGS_PER_KIND)
      .lean(),
    FallEvent.find(query)
      .select("severity status timestamp latitude longitude")
      .sort({ timestamp: -1 })
      .limit(MAX_READINGS_PER_KIND)
      .lean(),
  ]);

  return {
    sessionId: String(session._id),
    window: {
      from: windowStart.toISOString(),
      to: windowEnd.toISOString(),
    },
    data: {
      vitals: projectReadings(vitals, ["heartRate", "spo2", "timestamp"]),
      environment: projectReadings(environment, [
        "temperature",
        "humidity",
        "pressure",
        "timestamp",
      ]),
      locations: projectReadings(locations, ["latitude", "longitude", "timestamp"]),
      falls: projectReadings(falls, [
        "severity",
        "status",
        "timestamp",
        "latitude",
        "longitude",
      ]),
    },
  };
}

async function closeSession(actorId, actorRole, sessionId) {
  validateObjectId(sessionId, "sessionId");
  const session = await EmergencySession.findOne({
    _id: sessionId,
    status: { $in: ["REQUESTED", "ACTIVE"] },
  });
  if (!session) {
    throw new AppError("Open emergency session not found", 404, "SESSION_NOT_FOUND");
  }
  const isParticipant =
    sameId(actorId, session.requesterId) ||
    sameId(actorId, session.assignedResponderId) ||
    sameId(actorId, session.authorizedById);
  if (!isParticipant && actorRole !== "admin") {
    throw new AppError("Access to this emergency session is forbidden", 403, "FORBIDDEN");
  }

  const closedSession = await EmergencySession.findOneAndUpdate(
    { _id: sessionId, status: { $in: ["REQUESTED", "ACTIVE"] } },
    {
      $set: {
        status: "CLOSED",
        closedAt: new Date(),
        closedById: actorId,
      },
    },
    { new: true, runValidators: true },
  );
  if (!closedSession) {
    throw new AppError("Emergency session is already closed", 409, "SESSION_CLOSED");
  }
  await writeAudit({
    action: "emergency.session.closed",
    actorId,
    session: closedSession,
  });
  return closedSession;
}

module.exports = {
  EMERGENCY_HISTORY_HOURS,
  MAX_READINGS_PER_KIND,
  requestSession,
  assignSession,
  listPendingSessions,
  getSessionAudit,
  getEmergencyData,
  closeSession,
};
