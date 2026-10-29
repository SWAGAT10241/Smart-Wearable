const crypto = require("crypto");
const EmergencySession = require("../models/EmergencySession");
const RiskAssessment = require("../models/RiskAssessment");
const AuditLog = require("../models/AuditLog");
const Device = require("../models/Device");
const User = require("../models/User");
const VitalsReading = require("../models/VitalsReading");
const EnvironmentReading = require("../models/EnvironmentReading");
const LocationReading = require("../models/LocationReading");
const FallEvent = require("../models/FallEvent");
const socketManager = require("../realtime/socketManager");
const AppError = require("../utils/appError");

const EMERGENCY_HISTORY_HOURS = 6;
const MAX_READINGS_PER_KIND = 100;

/**
 * Helper to record security audit logs.
 * When failClosed is true, errors cause an AppError to be thrown to prevent unaudited operations.
 */
async function recordAudit(
  { actorId, actorRole, action, targetResource, metadata, ipAddress, userAgent },
  failClosed = false,
) {
  try {
    return await AuditLog.create({
      actorId,
      actorRole: actorRole || "citizen",
      action,
      targetResource,
      metadata: metadata || {},
      ipAddress: ipAddress || "",
      userAgent: userAgent || "",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to write audit log:", error.message);
    if (failClosed) {
      throw new AppError("Security audit logging failed; operation aborted", 500, "AUDIT_FAILURE");
    }
  }
}

/**
 * Create a new EmergencySession.
 */
async function createSession(data, user, requestMeta = {}) {
  const { deviceId, triggerType, location, vitalsSummary, initialRisk } = data;

  if (!deviceId || typeof deviceId !== "string") {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const allowedTriggers = ["manual_sos", "fall_confirmed", "vitals_critical", "panic_button"];
  if (!triggerType || !allowedTriggers.includes(triggerType)) {
    throw new AppError(`triggerType must be one of: ${allowedTriggers.join(", ")}`, 400, "VALIDATION_ERROR");
  }

  if (!location || location.latitude == null || location.longitude == null) {
    throw new AppError("location with latitude and longitude is required", 400, "VALIDATION_ERROR");
  }

  const normalizedDeviceId = deviceId.trim().toUpperCase();

  // Verify device ownership or authorization
  const device = await Device.findOne({
    deviceId: normalizedDeviceId,
    userId: user._id,
    status: "active",
  });

  if (!device && user.role === "citizen") {
    throw new AppError("Device is not paired or active for this user", 404, "DEVICE_NOT_FOUND");
  }

  const sessionId = crypto.randomUUID();
  const historicalWindowStart = new Date(Date.now() - EMERGENCY_HISTORY_HOURS * 60 * 60 * 1000);
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h ephemeral TTL

  const session = await EmergencySession.create({
    sessionId,
    userId: user._id,
    deviceId: normalizedDeviceId,
    triggerType,
    status: "active",
    location: {
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      accuracy: location.accuracy != null ? Number(location.accuracy) : undefined,
      altitude: location.altitude != null ? Number(location.altitude) : undefined,
      recordedAt: new Date(),
    },
    vitalsSummary: vitalsSummary || {},
    historicalWindowStart,
    activeResponders: [],
    expiresAt,
  });

  // Optional initial risk assessment
  if (initialRisk && typeof initialRisk === "object") {
    try {
      await RiskAssessment.create({
        deviceId: normalizedDeviceId,
        userId: user._id,
        emergencySessionId: sessionId,
        riskLevel: initialRisk.riskLevel || "high",
        category: initialRisk.category || "manual_concern",
        confidenceScore: initialRisk.confidenceScore ?? 0.9,
        isEmergencyConfirmed: true,
        sensorSnapshot: initialRisk.sensorSnapshot || {},
        evaluatedAt: new Date(),
      });
    } catch (riskErr) {
      console.warn("Failed to create initial RiskAssessment:", riskErr.message);
    }
  }

  // Audit emergency session creation
  await recordAudit({
    actorId: user._id,
    actorRole: user.role,
    action: "EMERGENCY_SESSION_CREATED",
    targetResource: `EmergencySession:${sessionId}`,
    metadata: { triggerType, deviceId: normalizedDeviceId },
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  // Broadcast to rescue feed listeners
  socketManager.broadcastEmergencyEvent(sessionId, "emergency_session_created", session);

  return session;
}

/**
 * List active emergency sessions.
 */
async function getActiveSessions(user) {
  let query = { status: { $in: ["active", "escalated"] } };

  if (user.role === "citizen") {
    query.userId = user._id;
  }

  const sessions = await EmergencySession.find(query)
    .sort({ createdAt: -1 })
    .populate("userId", "username phoneNumber emergencyContactName emergencyContactPhone");

  return sessions;
}

/**
 * Fetch a single emergency session by sessionId.
 */
async function getSessionById(sessionId, user, requestMeta = {}) {
  if (!sessionId || typeof sessionId !== "string") {
    throw new AppError("sessionId is required", 400, "VALIDATION_ERROR");
  }

  const session = await EmergencySession.findOne({ sessionId: sessionId.trim() }).populate(
    "userId",
    "username phoneNumber emergencyContactName emergencyContactPhone",
  );

  if (!session) {
    throw new AppError("Emergency session not found", 404, "SESSION_NOT_FOUND");
  }

  // Authorization check
  const isOwner = String(session.userId._id || session.userId) === String(user._id);
  const isAssigned = session.activeResponders?.some(
    (r) => String(r.responderId) === String(user._id),
  );
  const isRescueStaff = ["responder", "coordinator", "admin"].includes(user.role);

  if (!isOwner && !isAssigned && !isRescueStaff) {
    throw new AppError("Access to this emergency session is forbidden", 403, "FORBIDDEN");
  }

  await recordAudit({
    actorId: user._id,
    actorRole: user.role,
    action: "EMERGENCY_SESSION_ACCESSED",
    targetResource: `EmergencySession:${sessionId}`,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return session;
}

/**
 * Update the status of an emergency session (escalate, resolve, cancel).
 */
async function updateSessionStatus(sessionId, { status, resolutionNote }, user, requestMeta = {}) {
  if (!sessionId || typeof sessionId !== "string") {
    throw new AppError("sessionId is required", 400, "VALIDATION_ERROR");
  }

  const allowedStatuses = ["active", "escalated", "resolved", "cancelled"];
  if (!status || !allowedStatuses.includes(status)) {
    throw new AppError(`status must be one of: ${allowedStatuses.join(", ")}`, 400, "VALIDATION_ERROR");
  }

  const session = await EmergencySession.findOne({ sessionId: sessionId.trim() });
  if (!session) {
    throw new AppError("Emergency session not found", 404, "SESSION_NOT_FOUND");
  }

  if (["resolved", "cancelled", "expired"].includes(session.status)) {
    throw new AppError("Emergency session is already concluded", 409, "SESSION_CONCLUDED");
  }

  const isOwner = String(session.userId) === String(user._id);
  const isRescueStaff = ["responder", "coordinator", "admin"].includes(user.role);

  if (status === "cancelled" && !isOwner && user.role !== "admin") {
    throw new AppError("Only the session owner or admin can cancel an emergency session", 403, "FORBIDDEN");
  }

  if (status === "escalated" && !isRescueStaff) {
    throw new AppError("Only rescue responders or coordinators can escalate emergency sessions", 403, "FORBIDDEN");
  }

  session.status = status;
  if (status === "resolved") {
    session.resolvedAt = new Date();
    session.resolvedBy = user._id;
    session.resolutionNote = resolutionNote || "";
  }

  await session.save();

  const auditAction = status === "resolved" ? "EMERGENCY_SESSION_RESOLVED" : "EMERGENCY_STATUS_UPDATED";
  await recordAudit({
    actorId: user._id,
    actorRole: user.role,
    action: auditAction,
    targetResource: `EmergencySession:${sessionId}`,
    metadata: { status, resolutionNote },
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  // Broadcast real-time status update to all session subscribers
  socketManager.broadcastEmergencyEvent(sessionId, "emergency_status_update", {
    sessionId,
    status,
    resolvedAt: session.resolvedAt,
    resolutionNote: session.resolutionNote,
  });

  return session;
}

/**
 * Update real-time location during an active emergency.
 */
async function updateSessionLocation(sessionId, locationData, user, requestMeta = {}) {
  if (!sessionId || typeof sessionId !== "string") {
    throw new AppError("sessionId is required", 400, "VALIDATION_ERROR");
  }

  if (!locationData || locationData.latitude == null || locationData.longitude == null) {
    throw new AppError("latitude and longitude are required", 400, "VALIDATION_ERROR");
  }

  const session = await EmergencySession.findOne({
    sessionId: sessionId.trim(),
    status: { $in: ["active", "escalated"] },
  });

  if (!session) {
    throw new AppError("Active emergency session not found", 404, "SESSION_NOT_FOUND");
  }

  const isOwner = String(session.userId) === String(user._id);
  if (!isOwner && user.role !== "admin") {
    throw new AppError("Only the session owner or admin can update emergency location", 403, "FORBIDDEN");
  }

  session.location = {
    latitude: Number(locationData.latitude),
    longitude: Number(locationData.longitude),
    accuracy: locationData.accuracy != null ? Number(locationData.accuracy) : session.location?.accuracy,
    altitude: locationData.altitude != null ? Number(locationData.altitude) : session.location?.altitude,
    recordedAt: new Date(),
  };

  await session.save();

  await recordAudit({
    actorId: user._id,
    actorRole: user.role,
    action: "EMERGENCY_LOCATION_UPDATED",
    targetResource: `EmergencySession:${sessionId}`,
    metadata: { location: session.location },
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  socketManager.broadcastEmergencyEvent(sessionId, "emergency_location_update", {
    sessionId,
    location: session.location,
  });

  return session.location;
}

/**
 * Update risk assessment for an emergency session.
 */
async function updateSessionRisk(sessionId, riskData, user, requestMeta = {}) {
  if (!sessionId || typeof sessionId !== "string") {
    throw new AppError("sessionId is required", 400, "VALIDATION_ERROR");
  }

  const session = await EmergencySession.findOne({
    sessionId: sessionId.trim(),
    status: { $in: ["active", "escalated"] },
  });

  if (!session) {
    throw new AppError("Active emergency session not found", 404, "SESSION_NOT_FOUND");
  }

  const isOwner = String(session.userId) === String(user._id);
  const isRescue = ["responder", "coordinator", "admin"].includes(user.role);

  if (!isOwner && !isRescue) {
    throw new AppError("Forbidden: insufficient permissions", 403, "FORBIDDEN");
  }

  const assessment = await RiskAssessment.create({
    emergencySessionId: sessionId,
    deviceId: session.deviceId,
    userId: session.userId,
    riskLevel: riskData.riskLevel || "high",
    category: riskData.category || "vitals_anomaly",
    confidenceScore: riskData.confidenceScore ?? 0.85,
    isEmergencyConfirmed: true,
    sensorSnapshot: riskData.sensorSnapshot || {},
    evaluatedAt: new Date(),
  });

  await recordAudit({
    actorId: user._id,
    actorRole: user.role,
    action: "EMERGENCY_RISK_UPDATED",
    targetResource: `EmergencySession:${sessionId}`,
    metadata: { assessmentId: assessment.assessmentId, riskLevel: assessment.riskLevel },
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  socketManager.broadcastEmergencyEvent(sessionId, "emergency_risk_update", {
    sessionId,
    risk: assessment,
  });

  return assessment;
}

/**
 * Assign a responder or allow a responder to join an emergency session.
 */
async function assignOrJoinResponder(sessionId, { responderId }, user, requestMeta = {}) {
  if (!sessionId || typeof sessionId !== "string") {
    throw new AppError("sessionId is required", 400, "VALIDATION_ERROR");
  }

  const session = await EmergencySession.findOne({
    sessionId: sessionId.trim(),
    status: { $in: ["active", "escalated"] },
  });

  if (!session) {
    throw new AppError("Active emergency session not found", 404, "SESSION_NOT_FOUND");
  }

  let targetResponderId = responderId;

  if (targetResponderId) {
    if (!["coordinator", "admin"].includes(user.role)) {
      throw new AppError("Only coordinators or admins can assign responders", 403, "FORBIDDEN");
    }
  } else {
    if (user.role !== "responder" && user.role !== "coordinator" && user.role !== "admin") {
      throw new AppError("Only authorized responders can join emergency sessions", 403, "FORBIDDEN");
    }
    targetResponderId = user._id;
  }

  const responderUser = await User.findById(targetResponderId).select("role username");
  if (!responderUser) {
    throw new AppError("Responder user not found", 404, "USER_NOT_FOUND");
  }

  if (!["responder", "coordinator", "admin"].includes(responderUser.role)) {
    throw new AppError("Assigned user must possess responder, coordinator, or admin privileges", 400, "INVALID_ROLE");
  }

  const alreadyJoined = session.activeResponders.some(
    (r) => String(r.responderId) === String(targetResponderId),
  );

  if (!alreadyJoined) {
    session.activeResponders.push({
      responderId: targetResponderId,
      joinedAt: new Date(),
      accessExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await session.save();
  }

  await recordAudit({
    actorId: user._id,
    actorRole: user.role,
    action: "RESPONDER_ASSIGNED",
    targetResource: `EmergencySession:${sessionId}`,
    metadata: { responderId: targetResponderId },
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  socketManager.broadcastEmergencyEvent(sessionId, "emergency_responder_update", {
    sessionId,
    responderId: targetResponderId,
    username: responderUser.username,
    joinedAt: new Date(),
  });

  return session;
}

/**
 * Get audit trail for an emergency session.
 */
async function getSessionAudit(sessionId, user) {
  if (!sessionId || typeof sessionId !== "string") {
    throw new AppError("sessionId is required", 400, "VALIDATION_ERROR");
  }

  if (!["coordinator", "admin"].includes(user.role)) {
    throw new AppError("Access to session audit logs requires coordinator or admin role", 403, "FORBIDDEN");
  }

  const entries = await AuditLog.find({ targetResource: `EmergencySession:${sessionId.trim()}` })
    .sort({ timestamp: -1 })
    .limit(200)
    .populate("actorId", "username email role");

  return entries;
}

/**
 * Controlled 6-hour historical telemetry access for authorized responders.
 */
async function getHistoricalData(sessionId, user, requestMeta = {}) {
  const session = await EmergencySession.findOne({
    sessionId: sessionId.trim(),
    status: { $in: ["active", "escalated"] },
  });

  if (!session) {
    throw new AppError("Active emergency session not found", 404, "SESSION_NOT_FOUND");
  }

  const isAssigned = session.activeResponders?.some((r) => String(r.responderId) === String(user._id));
  const isRescueCoord = ["coordinator", "admin"].includes(user.role);

  if (!isAssigned && !isRescueCoord) {
    throw new AppError("Access to emergency telemetry requires assigned responder or coordinator role", 403, "FORBIDDEN");
  }

  const windowEnd = new Date();
  const windowStart = session.historicalWindowStart || new Date(windowEnd.getTime() - EMERGENCY_HISTORY_HOURS * 60 * 60 * 1000);

  // Pre-access fail-closed audit logging
  await recordAudit(
    {
      actorId: user._id,
      actorRole: user.role,
      action: "HISTORICAL_VITALS_REQUESTED",
      targetResource: `EmergencySession:${sessionId}`,
      metadata: { windowStart, windowEnd },
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    },
    true,
  );

  const query = {
    userId: session.userId,
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
    sessionId,
    window: {
      from: windowStart.toISOString(),
      to: windowEnd.toISOString(),
    },
    data: {
      vitals,
      environment,
      locations,
      falls,
    },
  };
}

module.exports = {
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
