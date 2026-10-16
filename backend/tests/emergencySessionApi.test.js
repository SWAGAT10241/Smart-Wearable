process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const request = require("supertest");
const crypto = require("crypto");

const mockEmergencySessionCreate = jest.fn();
const mockEmergencySessionFind = jest.fn();
const mockEmergencySessionFindOne = jest.fn();

const mockRiskAssessmentCreate = jest.fn();
const mockAuditLogCreate = jest.fn();
const mockAuditLogFind = jest.fn();

const mockDeviceFindOne = jest.fn();
const mockUserFindById = jest.fn();
const mockVitalsFind = jest.fn();
const mockEnvironmentFind = jest.fn();
const mockLocationFind = jest.fn();
const mockFallFind = jest.fn();

const mockBroadcastEmergencyEvent = jest.fn();

jest.mock("../models/EmergencySession", () => ({
  create: mockEmergencySessionCreate,
  find: mockEmergencySessionFind,
  findOne: mockEmergencySessionFindOne,
}));

jest.mock("../models/RiskAssessment", () => ({
  create: mockRiskAssessmentCreate,
}));

jest.mock("../models/AuditLog", () => ({
  create: mockAuditLogCreate,
  find: mockAuditLogFind,
}));

jest.mock("../models/Device", () => ({
  findOne: mockDeviceFindOne,
}));

jest.mock("../models/User", () => ({
  findById: mockUserFindById,
}));

jest.mock("../models/VitalsReading", () => ({
  find: mockVitalsFind,
}));

jest.mock("../models/EnvironmentReading", () => ({
  find: mockEnvironmentFind,
}));

jest.mock("../models/LocationReading", () => ({
  find: mockLocationFind,
}));

jest.mock("../models/FallEvent", () => ({
  find: mockFallFind,
}));

jest.mock("../realtime/socketManager", () => {
  const actual = jest.requireActual("../realtime/socketManager");
  return {
    ...actual,
    broadcastEmergencyEvent: mockBroadcastEmergencyEvent,
  };
});

const mockWebSocketTicketCreate = jest.fn();

jest.mock("../models/WebSocketTicket", () => ({
  create: mockWebSocketTicketCreate,
  findOneAndDelete: jest.fn(),
}));

let mockCurrentUser = {
  _id: "507f1f77bcf86cd799439011",
  role: "citizen",
  username: "Test Citizen",
};

jest.mock("../middleware/authMiddleware", () => {
  return (req, res, next) => {
    req.userId = mockCurrentUser._id;
    req.user = mockCurrentUser;
    next();
  };
});

const { app } = require("../app");

describe("Emergency Session API & Real-time Integration", () => {
  const testSessionId = "44444444-4444-4444-4444-444444444444";
  const testDeviceId = "TG-WEARABLE-001";

  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = {
      _id: "507f1f77bcf86cd799439011",
      role: "citizen",
      username: "Test Citizen",
    };

    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockCurrentUser),
    });

    mockWebSocketTicketCreate.mockResolvedValue({
      ticket: "test-ticket-mock-12345",
      expiresIn: 60,
    });
  });

  describe("POST /api/emergency/sessions", () => {
    test("creates emergency session with TTL expiration and broadcasts event", async () => {
      mockDeviceFindOne.mockResolvedValue({
        deviceId: testDeviceId,
        userId: mockCurrentUser._id,
        status: "active",
      });

      const mockSession = {
        sessionId: testSessionId,
        userId: mockCurrentUser._id,
        deviceId: testDeviceId,
        triggerType: "manual_sos",
        status: "active",
        location: { latitude: 20.2961, longitude: 85.8245 },
        vitalsSummary: { heartRate: 110, spo2: 96 },
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      };

      mockEmergencySessionCreate.mockResolvedValue(mockSession);
      mockAuditLogCreate.mockResolvedValue({});

      const response = await request(app)
        .post("/api/emergency/sessions")
        .send({
          deviceId: testDeviceId,
          triggerType: "manual_sos",
          location: { latitude: 20.2961, longitude: 85.8245 },
          vitalsSummary: { heartRate: 110, spo2: 96 },
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.session.sessionId).toBe(testSessionId);

      expect(mockEmergencySessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockCurrentUser._id,
          deviceId: testDeviceId,
          triggerType: "manual_sos",
          status: "active",
          expiresAt: expect.any(Date),
        }),
      );

      expect(mockAuditLogCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          actorId: mockCurrentUser._id,
          action: "EMERGENCY_SESSION_CREATED",
          targetResource: expect.stringMatching(/^EmergencySession:[a-f0-9-]+$/),
        }),
      );

      expect(mockBroadcastEmergencyEvent).toHaveBeenCalledWith(
        expect.any(String),
        "emergency_session_created",
        mockSession,
      );
    });

    test("rejects invalid trigger type", async () => {
      const response = await request(app)
        .post("/api/emergency/sessions")
        .send({
          deviceId: testDeviceId,
          triggerType: "unsupported_trigger",
          location: { latitude: 20.2961, longitude: 85.8245 },
        });

      expect(response.statusCode).toBe(400);
      expect(mockEmergencySessionCreate).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/emergency/sessions/active", () => {
    test("returns active emergency sessions for citizen (filtered by userId)", async () => {
      const populateMock = jest.fn().mockResolvedValue([
        { sessionId: testSessionId, status: "active", userId: mockCurrentUser },
      ]);
      mockEmergencySessionFind.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: populateMock,
        }),
      });

      const response = await request(app).get("/api/emergency/sessions/active");

      expect(response.statusCode).toBe(200);
      expect(response.body.sessions).toHaveLength(1);
      expect(mockEmergencySessionFind).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockCurrentUser._id,
          status: { $in: ["active", "escalated"] },
        }),
      );
    });

    test("returns all active emergency sessions for coordinator", async () => {
      mockCurrentUser = {
        _id: "coordinator-id",
        role: "coordinator",
        username: "Rescue Coordinator",
      };

      const populateMock = jest.fn().mockResolvedValue([
        { sessionId: testSessionId, status: "active" },
        { sessionId: "session-2", status: "escalated" },
      ]);
      mockEmergencySessionFind.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: populateMock,
        }),
      });

      const response = await request(app).get("/api/emergency/sessions/active");

      expect(response.statusCode).toBe(200);
      expect(response.body.sessions).toHaveLength(2);
      expect(mockEmergencySessionFind).toHaveBeenCalledWith({
        status: { $in: ["active", "escalated"] },
      });
    });
  });

  describe("GET /api/emergency/sessions/:sessionId", () => {
    test("returns session details for owner and audits access", async () => {
      const mockSession = {
        sessionId: testSessionId,
        userId: { _id: mockCurrentUser._id },
        status: "active",
      };

      mockEmergencySessionFindOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSession),
      });

      const response = await request(app).get(`/api/emergency/sessions/${testSessionId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.session.sessionId).toBe(testSessionId);

      expect(mockAuditLogCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          actorId: mockCurrentUser._id,
          action: "EMERGENCY_SESSION_ACCESSED",
          targetResource: `EmergencySession:${testSessionId}`,
        }),
      );
    });

    test("forbids access to unauthorized citizens", async () => {
      const mockSession = {
        sessionId: testSessionId,
        userId: { _id: "other-citizen-id" },
        activeResponders: [],
        status: "active",
      };

      mockEmergencySessionFindOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSession),
      });

      const response = await request(app).get(`/api/emergency/sessions/${testSessionId}`);

      expect(response.statusCode).toBe(403);
    });
  });

  describe("PATCH /api/emergency/sessions/:sessionId/status", () => {
    test("allows owner to resolve session and broadcasts status update", async () => {
      const saveMock = jest.fn().mockResolvedValue(undefined);
      const mockSession = {
        sessionId: testSessionId,
        userId: mockCurrentUser._id,
        status: "active",
        save: saveMock,
      };

      mockEmergencySessionFindOne.mockResolvedValue(mockSession);

      const response = await request(app)
        .patch(`/api/emergency/sessions/${testSessionId}/status`)
        .send({
          status: "resolved",
          resolutionNote: "Citizen is safe with family.",
        });

      expect(response.statusCode).toBe(200);
      expect(mockSession.status).toBe("resolved");
      expect(mockSession.resolutionNote).toBe("Citizen is safe with family.");
      expect(saveMock).toHaveBeenCalled();

      expect(mockBroadcastEmergencyEvent).toHaveBeenCalledWith(
        testSessionId,
        "emergency_status_update",
        expect.objectContaining({
          sessionId: testSessionId,
          status: "resolved",
        }),
      );
    });
  });

  describe("POST /api/emergency/sessions/:sessionId/location", () => {
    test("updates live location during emergency and broadcasts update", async () => {
      const saveMock = jest.fn().mockResolvedValue(undefined);
      const mockSession = {
        sessionId: testSessionId,
        userId: mockCurrentUser._id,
        status: "active",
        location: { latitude: 20.0, longitude: 85.0 },
        save: saveMock,
      };

      mockEmergencySessionFindOne.mockResolvedValue(mockSession);

      const response = await request(app)
        .post(`/api/emergency/sessions/${testSessionId}/location`)
        .send({
          latitude: 20.2975,
          longitude: 85.8250,
          accuracy: 5.2,
        });

      expect(response.statusCode).toBe(200);
      expect(mockSession.location.latitude).toBe(20.2975);
      expect(mockSession.location.longitude).toBe(85.8250);
      expect(saveMock).toHaveBeenCalled();

      expect(mockBroadcastEmergencyEvent).toHaveBeenCalledWith(
        testSessionId,
        "emergency_location_update",
        expect.objectContaining({
          sessionId: testSessionId,
          location: expect.objectContaining({
            latitude: 20.2975,
            longitude: 85.8250,
          }),
        }),
      );
    });
  });

  describe("POST /api/emergency/ws-ticket", () => {
    test("generates single-use WebSocket ticket for authenticated user", async () => {
      const response = await request(app).post("/api/emergency/ws-ticket");

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("ticket");
      expect(response.body.expiresIn).toBe(60);
    });
  });
});
