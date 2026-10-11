const mockDeviceFindOne = jest.fn();
const mockSessionCreate = jest.fn();
const mockSessionFindOne = jest.fn();
const mockSessionFindOneAndUpdate = jest.fn();
const mockSessionFind = jest.fn();
const mockSessionFindById = jest.fn();
const mockUserFindById = jest.fn();
const mockAuditCreate = jest.fn();
const mockAuditFind = jest.fn();
const mockVitalsFind = jest.fn();
const mockEnvironmentFind = jest.fn();
const mockLocationFind = jest.fn();
const mockFallFind = jest.fn();

jest.mock("../models/Device", () => ({ findOne: mockDeviceFindOne }));
jest.mock("../models/EmergencySession", () => ({
  create: mockSessionCreate,
  findOne: mockSessionFindOne,
  findOneAndUpdate: mockSessionFindOneAndUpdate,
  find: mockSessionFind,
  findById: mockSessionFindById,
}));
jest.mock("../models/User", () => ({ findById: mockUserFindById }));
jest.mock("../models/SecurityAuditLog", () => ({
  create: mockAuditCreate,
  find: mockAuditFind,
}));
jest.mock("../models/VitalsReading", () => ({ find: mockVitalsFind }));
jest.mock("../models/EnvironmentReading", () => ({ find: mockEnvironmentFind }));
jest.mock("../models/LocationReading", () => ({ find: mockLocationFind }));
jest.mock("../models/FallEvent", () => ({ find: mockFallFind }));

const AppError = require("../utils/appError");
const service = require("../services/emergencySessionService");

function makeReadQuery(results) {
  const query = {
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(results),
  };
  return query;
}

describe("emergencySessionService", () => {
  const requesterId = "507f1f77bcf86cd799439011";
  const coordinatorId = "507f1f77bcf86cd799439012";
  const responderId = "507f1f77bcf86cd799439013";
  const sessionId = "507f1f77bcf86cd799439014";
  const deviceId = "550e8400-e29b-41d4-a716-446655440000";
  const activeSession = {
    _id: sessionId,
    requesterId,
    deviceId: deviceId.toUpperCase(),
    status: "ACTIVE",
    assignedResponderId: responderId,
    authorizedById: coordinatorId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuditCreate.mockResolvedValue({});
  });

  test("creates a citizen request only for their paired active device and audits it", async () => {
    mockDeviceFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({ deviceId }),
    });
    mockSessionCreate.mockResolvedValue({
      _id: sessionId,
      requesterId,
      deviceId,
      status: "REQUESTED",
    });

    const result = await service.requestSession(requesterId, deviceId.toLowerCase());

    expect(mockDeviceFindOne).toHaveBeenCalledWith({
      deviceId: deviceId.toUpperCase(),
      userId: requesterId,
      state: "PAIRED",
      status: "active",
    });
    expect(mockAuditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "emergency.session.requested",
        actorId: requesterId,
        sessionId,
      }),
    );
    expect(result.status).toBe("REQUESTED");
  });

  test("does not create a request for a device not owned and actively paired", async () => {
    mockDeviceFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(service.requestSession(requesterId, deviceId)).rejects.toMatchObject({
      statusCode: 404,
      code: "DEVICE_NOT_FOUND",
    });
    expect(mockSessionCreate).not.toHaveBeenCalled();
    expect(mockAuditCreate).not.toHaveBeenCalled();
  });

  test("assigns only a responder and atomically activates the request", async () => {
    mockSessionFindOne.mockResolvedValue({ _id: sessionId, status: "REQUESTED" });
    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ role: "responder" }),
    });
    mockSessionFindOneAndUpdate.mockResolvedValue(activeSession);

    await service.assignSession(coordinatorId, sessionId, responderId);

    expect(mockSessionFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: sessionId, status: "REQUESTED" },
      {
        $set: expect.objectContaining({
          status: "ACTIVE",
          assignedResponderId: responderId,
          authorizedById: coordinatorId,
          activatedAt: expect.any(Date),
        }),
      },
      { new: true, runValidators: true },
    );
    expect(mockAuditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "emergency.session.assigned",
        actorId: coordinatorId,
        targetUserId: requesterId,
      }),
    );
  });

  test("rejects non-responder assignments and does not activate a session", async () => {
    mockSessionFindOne.mockResolvedValue({ _id: sessionId, status: "REQUESTED" });
    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ role: "citizen" }),
    });
    await expect(
      service.assignSession(coordinatorId, sessionId, responderId),
    ).rejects.toMatchObject({ code: "INVALID_RESPONDER" });
    expect(mockSessionFindOneAndUpdate).not.toHaveBeenCalled();
    expect(mockAuditCreate).not.toHaveBeenCalled();
  });

  test("lists pending requests without including medical or contact details", async () => {
    const pending = {
      _id: sessionId,
      requesterId,
      deviceId,
      createdAt: new Date(),
      latitude: 1,
      emergencyContactPhone: "private",
    };
    const query = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([pending]),
    };
    mockSessionFind.mockReturnValue(query);

    const result = await service.listPendingSessions();

    expect(mockSessionFind).toHaveBeenCalledWith({ status: "REQUESTED" });
    expect(query.limit).toHaveBeenCalledWith(100);
    expect(result).toEqual([
      {
        sessionId,
        requesterId,
        deviceId,
        createdAt: pending.createdAt,
      },
    ]);
  });

  test("requires a participant and active session before recording or reading protected data", async () => {
    mockSessionFindOne.mockResolvedValue({
      ...activeSession,
      assignedResponderId: "507f1f77bcf86cd799439099",
    });

    await expect(
      service.getEmergencyData(responderId, sessionId, "responder"),
    ).rejects.toBeInstanceOf(AppError);
    expect(mockAuditCreate).not.toHaveBeenCalled();
    expect(mockVitalsFind).not.toHaveBeenCalled();
  });

  test("denies citizen history access through the emergency responder endpoint", async () => {
    await expect(
      service.getEmergencyData(requesterId, sessionId, "citizen"),
    ).rejects.toMatchObject({ statusCode: 403, code: "FORBIDDEN" });
    expect(mockSessionFindOne).not.toHaveBeenCalled();
    expect(mockAuditCreate).not.toHaveBeenCalled();
  });

  test("returns minimized data from at most six hours after writing an audit record", async () => {
    const now = new Date("2026-10-11T10:00:00.000Z");
    jest.useFakeTimers().setSystemTime(now);
    mockSessionFindOne.mockResolvedValue(activeSession);
    mockVitalsFind.mockReturnValue(
      makeReadQuery([{ heartRate: 88, spo2: 98, timestamp: now, userId: requesterId, irSamples: [1] }]),
    );
    mockEnvironmentFind.mockReturnValue(
      makeReadQuery([{ temperature: 22, humidity: 50, pressure: 1000, timestamp: now }]),
    );
    mockLocationFind.mockReturnValue(
      makeReadQuery([{ latitude: 1, longitude: 2, timestamp: now, deviceId }]),
    );
    mockFallFind.mockReturnValue(
      makeReadQuery([{ severity: "moderate", status: "detected", timestamp: now, secret: "omit" }]),
    );

    try {
      const result = await service.getEmergencyData(responderId, sessionId, "responder");
      const window = mockAuditCreate.mock.calls[0][0];
      expect(window).toMatchObject({
        action: "emergency.session.data_accessed",
        actorId: responderId,
        windowStart: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        windowEnd: now,
      });
      expect(mockAuditCreate.mock.invocationCallOrder[0]).toBeLessThan(
        mockVitalsFind.mock.invocationCallOrder[0],
      );
      expect(result.data.vitals).toEqual([
        { heartRate: 88, spo2: 98, timestamp: now },
      ]);
      expect(result.data.locations).toEqual([{ latitude: 1, longitude: 2, timestamp: now }]);
      expect(result.data.falls[0]).not.toHaveProperty("secret");
      expect(mockVitalsFind).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: requesterId,
          deviceId: deviceId.toUpperCase(),
          timestamp: {
            $gte: new Date(now.getTime() - 6 * 60 * 60 * 1000),
            $lte: now,
          },
        }),
      );
      expect(mockVitalsFind.mock.results[0].value.limit).toHaveBeenCalledWith(500);
    } finally {
      jest.useRealTimers();
    }
  });

  test("fails closed when the access audit cannot be persisted", async () => {
    mockSessionFindOne.mockResolvedValue(activeSession);
    mockAuditCreate.mockRejectedValue(new Error("audit database unavailable"));

    await expect(
      service.getEmergencyData(responderId, sessionId, "responder"),
    ).rejects.toThrow("audit database unavailable");
    expect(mockVitalsFind).not.toHaveBeenCalled();
  });

  test("closes only a participant session and records the actor", async () => {
    const closedSession = { ...activeSession, status: "CLOSED" };
    mockSessionFindOne.mockResolvedValue(activeSession);
    mockSessionFindOneAndUpdate.mockResolvedValue(closedSession);

    const result = await service.closeSession(responderId, "responder", sessionId);

    expect(result.status).toBe("CLOSED");
    expect(mockSessionFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: sessionId, status: { $in: ["REQUESTED", "ACTIVE"] } },
      { $set: expect.objectContaining({ status: "CLOSED", closedById: responderId }) },
      { new: true, runValidators: true },
    );
    expect(mockAuditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "emergency.session.closed",
        actorId: responderId,
      }),
    );
  });

  test("returns only authorized audit metadata", async () => {
    const createdAt = new Date();
    mockSessionFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: sessionId }),
    });
    mockAuditFind.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([
        {
          action: "emergency.session.data_accessed",
          actorId: responderId,
          createdAt,
          windowStart: createdAt,
          windowEnd: createdAt,
          latitude: 1,
          contact: "private",
        },
      ]),
    });

    const result = await service.getSessionAudit(sessionId);

    expect(result).toEqual([
      {
        action: "emergency.session.data_accessed",
        actorId: responderId,
        occurredAt: createdAt,
        windowStart: createdAt,
        windowEnd: createdAt,
      },
    ]);
  });
});
