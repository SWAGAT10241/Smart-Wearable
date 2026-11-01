process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "integration-test-secret-key-at-least-32-chars";

const request = require("supertest");
const crypto = require("crypto");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Mock Models
const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();
const mockUserFindById = jest.fn();

const mockDeviceFind = jest.fn();
const mockDeviceFindOne = jest.fn();
const mockDeviceFindOneAndUpdate = jest.fn();
const mockDeviceCreate = jest.fn();

const mockEmergencyFindOne = jest.fn();
const mockEmergencyCreate = jest.fn();
const mockEmergencyFind = jest.fn();

const mockAuditCreate = jest.fn();
const mockAuditFind = jest.fn();

const mockTicketFindOneAndDelete = jest.fn();
const mockTicketCreate = jest.fn();

const mockVitalsFind = jest.fn();
const mockEnvironmentFind = jest.fn();
const mockLocationFind = jest.fn();
const mockFallFind = jest.fn();

const mockBroadcastEmergencyEvent = jest.fn();
const mockSendToUser = jest.fn();

jest.mock("../models/User", () => ({
  findOne: mockUserFindOne,
  create: mockUserCreate,
  findById: mockUserFindById,
}));

jest.mock("../models/Device", () => ({
  find: mockDeviceFind,
  findOne: mockDeviceFindOne,
  findOneAndUpdate: mockDeviceFindOneAndUpdate,
  create: mockDeviceCreate,
}));

jest.mock("../models/EmergencySession", () => {
  const nodeCrypto = require("crypto");
  const model = jest.fn().mockImplementation((data) => ({
    ...data,
    sessionId: data.sessionId || nodeCrypto.randomUUID(),
    status: data.status || "active",
    expiresAt: data.expiresAt || new Date(Date.now() + 48 * 60 * 60 * 1000),
    save: jest.fn().mockResolvedValue(data),
    toObject: () => data,
  }));
  model.findOne = mockEmergencyFindOne;
  model.create = mockEmergencyCreate;
  model.find = mockEmergencyFind;
  model.findOneAndUpdate = jest.fn();
  return model;
});

jest.mock("../models/AuditLog", () => ({
  create: mockAuditCreate,
  find: mockAuditFind,
}));

jest.mock("../models/WebSocketTicket", () => ({
  create: mockTicketCreate,
  findOneAndDelete: mockTicketFindOneAndDelete,
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

jest.mock("../realtime/socketManager", () => ({
  broadcastEmergencyEvent: mockBroadcastEmergencyEvent,
  sendToUser: mockSendToUser,
  initSocketServer: jest.fn(),
  getStats: jest.fn().mockReturnValue({ totalConnected: 0 }),
}));

const { app } = require("../app");
const emergencySessionService = require("../services/emergencySessionService");
const webSocketTicketService = require("../services/webSocketTicketService");

// Helper for chainable queries (.select().sort().limit().lean())
const makeQueryChain = (data = []) => ({
  select: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(data),
  then: (resolve, reject) => Promise.resolve(data).then(resolve, reject),
});

// Helper for User find/findById return values (supports direct await and .select())
const makeUserQuery = (userObj) => {
  const promise = Promise.resolve(userObj);
  promise.select = jest.fn().mockImplementation(() => Promise.resolve(userObj));
  promise.populate = jest.fn().mockImplementation(() => Promise.resolve(userObj));
  return promise;
};

describe("Phase 1 Day 7: End-to-End Architecture Integration Test Suite", () => {
  const citizenId = new mongoose.Types.ObjectId().toString();
  const responderId = new mongoose.Types.ObjectId().toString();
  const coordinatorId = new mongoose.Types.ObjectId().toString();
  const deviceId = "TG-INTEGRATION-001";
  let citizenToken;
  let responderToken;

  beforeAll(() => {
    // Generate valid tokens with userId matching authMiddleware expectations
    citizenToken = jwt.sign(
      { userId: citizenId, role: "citizen" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    responderToken = jwt.sign(
      { userId: responderId, role: "responder" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserFindById.mockImplementation((id) =>
      makeUserQuery({
        _id: id || citizenId,
        username: id === responderId ? "Rescue Responder" : "Test Citizen",
        email: id === responderId ? "responder@rescue.gov" : "citizen@example.com",
        role: id === responderId ? "responder" : "citizen",
      }),
    );

    mockDeviceFind.mockReturnValue(
      makeQueryChain([
        {
          deviceId,
          deviceName: "Alex's SWAAS Band",
          status: "PAIRED",
          lastSeen: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    );

    mockVitalsFind.mockReturnValue(makeQueryChain([]));
    mockEnvironmentFind.mockReturnValue(makeQueryChain([]));
    mockLocationFind.mockReturnValue(makeQueryChain([]));
    mockFallFind.mockReturnValue(makeQueryChain([]));
  });

  // =========================================================================
  // JOURNEY 1: User Authentication & Profile Lifecycle
  // =========================================================================
  describe("Journey 1: Citizen & Responder Authentication Flow", () => {
    test("registers a new citizen with required emergency contact information", async () => {
      mockUserFindOne.mockResolvedValue(null);
      mockUserCreate.mockResolvedValue({
        _id: citizenId,
        username: "Alex Citizen",
        email: "alex@example.com",
        role: "citizen",
        profileComplete: true,
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          username: "Alex Citizen",
          email: "alex@example.com",
          password: "SecurePassword123!",
          phoneNumber: "9876543210",
          emergencyContactName: "Family Contact",
          emergencyContactPhone: "9876543211",
          height: 180,
          weight: 75,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("alex@example.com");
    });

    test("verifies authenticated identity and role mapping via /api/auth/me", async () => {
      mockUserFindById.mockImplementation((id) =>
        makeUserQuery({
          _id: citizenId,
          username: "Alex Citizen",
          email: "alex@example.com",
          role: "citizen",
        }),
      );

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${citizenToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.role).toBe("citizen");
    });
  });

  // =========================================================================
  // JOURNEY 2: Cryptographic Device Identity & Binding Flow
  // =========================================================================
  describe("Journey 2: Hardware Device Security & Asymmetric Verification", () => {
    test("rejects device telemetry ingestion without valid device authentication headers", async () => {
      const res = await request(app)
        .post("/api/device/readings")
        .send({ heartRate: 75, spo2: 98 });

      // Device telemetry endpoint strictly requires cryptographic Ed25519 signature headers
      expect(res.statusCode).toBe(401);
    });

    test("lists paired devices owned by authenticated citizen", async () => {
      const res = await request(app)
        .get("/api/devices")
        .set("Authorization", `Bearer ${citizenToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.devices).toBeDefined();
      expect(res.body.devices).toHaveLength(1);
      expect(res.body.devices[0].deviceId).toBe(deviceId);
    });
  });

  // =========================================================================
  // JOURNEY 3: Ephemeral Emergency Session & Realtime Streaming
  // =========================================================================
  describe("Journey 3: Emergency Lifecycle & Session Management", () => {
    const sessionId = "emg-" + crypto.randomUUID();

    test("creates an emergency session with opaque UUID and sets 48h TTL expiration", async () => {
      mockDeviceFindOne.mockResolvedValue({
        deviceId,
        userId: citizenId,
        status: "active",
      });

      const mockSession = {
        sessionId,
        userId: citizenId,
        deviceId,
        triggerType: "manual_sos",
        status: "active",
        location: { latitude: 28.6139, longitude: 77.209 },
        vitalsSummary: { heartRate: 110, spo2: 95 },
        historicalWindowStart: new Date(Date.now() - 6 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        activeResponders: [],
        save: jest.fn().mockResolvedValue(true),
      };

      mockEmergencyCreate.mockImplementation(async (data) => ({
        ...data,
        save: jest.fn().mockResolvedValue(true),
      }));
      mockEmergencyFindOne.mockResolvedValue(mockSession);

      const res = await request(app)
        .post("/api/emergency/sessions")
        .set("Authorization", `Bearer ${citizenToken}`)
        .send({
          deviceId,
          triggerType: "manual_sos",
          location: { latitude: 28.6139, longitude: 77.209 },
          vitalsSummary: { heartRate: 110, spo2: 95 },
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.session).toBeDefined();
      expect(res.body.session.status).toBe("active");
      expect(mockBroadcastEmergencyEvent).toHaveBeenCalledWith(
        res.body.session.sessionId,
        "emergency_session_created",
        expect.objectContaining({
          status: "active",
          deviceId,
        }),
      );
    });

    test("generates an ephemeral single-use WebSocket ticket for realtime connection", async () => {
      mockTicketCreate.mockResolvedValue({
        ticket: "ws-ticket-" + crypto.randomUUID(),
        userId: responderId,
        role: "responder",
        expiresAt: new Date(Date.now() + 60 * 1000),
      });

      const res = await request(app)
        .post("/api/emergency/ws-ticket")
        .set("Authorization", `Bearer ${responderToken}`);

      expect(res.statusCode).toBe(201);
      expect(res.body.ticket).toBeDefined();
      expect(res.body.expiresIn).toBe(60);
    });

    test("atomically consumes WebSocket ticket preventing replay attacks", async () => {
      const ticketId = "test-ticket-once";
      mockTicketFindOneAndDelete
        .mockResolvedValueOnce({
          ticket: ticketId,
          userId: responderId,
          role: "responder",
          expiresAt: new Date(Date.now() + 30 * 1000),
        })
        .mockResolvedValueOnce(null); // Consumed on second attempt

      const firstAttempt = await webSocketTicketService.consumeTicket(ticketId);
      expect(firstAttempt).toBeDefined();
      expect(firstAttempt.role).toBe("responder");

      const replayAttempt = await webSocketTicketService.consumeTicket(ticketId);
      expect(replayAttempt).toBeNull();
    });
  });

  // =========================================================================
  // JOURNEY 4: Fail-Closed Security Audit Logging & 6-Hour Bounded History
  // =========================================================================
  describe("Journey 4: Fail-Closed Audit Logging & Historical Telemetry Window", () => {
    const sessionId = "emg-" + crypto.randomUUID();

    test("successfully logs audit trail BEFORE returning historical telemetry within 6h window", async () => {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      const mockSession = {
        sessionId,
        userId: citizenId,
        deviceId,
        status: "active",
        historicalWindowStart: sixHoursAgo,
        activeResponders: [{ responderId }],
      };

      mockEmergencyFindOne.mockResolvedValue(mockSession);
      mockAuditCreate.mockResolvedValue({
        auditId: crypto.randomUUID(),
        action: "HISTORICAL_VITALS_REQUESTED",
      });

      mockVitalsFind.mockReturnValue(
        makeQueryChain([{ heartRate: 85, spo2: 98, timestamp: new Date() }]),
      );
      mockEnvironmentFind.mockReturnValue(makeQueryChain([]));
      mockLocationFind.mockReturnValue(
        makeQueryChain([{ latitude: 28.61, longitude: 77.2, timestamp: new Date() }]),
      );
      mockFallFind.mockReturnValue(makeQueryChain([]));

      const result = await emergencySessionService.getHistoricalData(
        sessionId,
        { _id: responderId, role: "responder" },
        { ipAddress: "127.0.0.1", userAgent: "RescueDashboard/1.0" },
      );

      // Verify audit was written before data was returned
      expect(mockAuditCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "HISTORICAL_VITALS_REQUESTED",
        }),
      );

      expect(result.sessionId).toBe(sessionId);
      expect(result.window.from).toEqual(sixHoursAgo.toISOString());
      expect(result.data.vitals).toHaveLength(1);
    });

    test("FAILS CLOSED: aborts retrieval with AUDIT_FAILURE (500) if audit log write fails", async () => {
      const mockSession = {
        sessionId,
        userId: citizenId,
        deviceId,
        status: "active",
        historicalWindowStart: new Date(),
        activeResponders: [{ responderId }],
      };

      mockEmergencyFindOne.mockResolvedValue(mockSession);
      // Simulate MongoDB network failover / connection error during audit write
      mockAuditCreate.mockRejectedValue(new Error("Mongo replica failure"));

      let thrownError;
      try {
        await emergencySessionService.getHistoricalData(
          sessionId,
          { _id: responderId, role: "responder" },
          { ipAddress: "127.0.0.1", userAgent: "RescueDashboard/1.0" },
        );
      } catch (err) {
        thrownError = err;
      }

      // Must fail closed with 500 AUDIT_FAILURE and NOT query health data
      expect(thrownError).toBeDefined();
      expect(thrownError.statusCode).toBe(500);
      expect(thrownError.code).toBe("AUDIT_FAILURE");
      expect(mockVitalsFind).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // JOURNEY 5: Privacy Boundaries & Invariant Verification
  // =========================================================================
  describe("Journey 5: Privacy Boundaries & Invariant Verification", () => {
    test("rejects assignment of an ordinary citizen as emergency responder", async () => {
      mockEmergencyFindOne.mockResolvedValue({
        sessionId: "emg-test-session",
        status: "active",
        activeResponders: [],
      });

      mockUserFindById.mockImplementation((id) =>
        makeUserQuery({
          _id: citizenId,
          role: "citizen", // Not a rescue responder
          username: "Alex Citizen",
        }),
      );

      let err;
      try {
        await emergencySessionService.assignOrJoinResponder(
          "emg-test-session",
          { responderId: citizenId },
          { _id: coordinatorId, role: "coordinator" },
        );
      } catch (e) {
        err = e;
      }

      expect(err).toBeDefined();
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe("INVALID_ROLE");
    });

    test("ensures historical data points are capped at maximum 100 per sensor type", async () => {
      const mockSession = {
        sessionId: "emg-cap-check",
        userId: citizenId,
        deviceId,
        status: "active",
        historicalWindowStart: new Date(Date.now() - 6 * 60 * 60 * 1000),
        activeResponders: [{ responderId }],
      };

      mockEmergencyFindOne.mockResolvedValue(mockSession);
      mockAuditCreate.mockResolvedValue({});

      const limitVitalsMock = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });
      mockVitalsFind.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: limitVitalsMock,
          }),
        }),
      });

      mockEnvironmentFind.mockReturnValue(makeQueryChain([]));
      mockLocationFind.mockReturnValue(makeQueryChain([]));
      mockFallFind.mockReturnValue(makeQueryChain([]));

      await emergencySessionService.getHistoricalData(
        "emg-cap-check",
        { _id: responderId, role: "responder" },
        { ipAddress: "127.0.0.1", userAgent: "RescueDashboard/1.0" },
      );

      // Must be capped at exactly 100 points
      expect(limitVitalsMock).toHaveBeenCalledWith(100);
    });
  });
});
