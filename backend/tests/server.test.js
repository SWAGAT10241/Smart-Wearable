process.env.NODE_ENV = "test";

const crypto = require("crypto");
const mongoose = require("mongoose");
const request = require("supertest");

const mockDeviceFindOne = jest.fn();
const mockDeviceCreate = jest.fn();
const mockDeviceFindOneAndUpdate = jest.fn();
const mockDevicePairingCreate = jest.fn();
const mockDevicePairingFindOne = jest.fn();
const mockDevicePairingFindOneAndUpdate = jest.fn();
const mockDevicePairingUpdateOne = jest.fn();

const mockVitalsCreate = jest.fn();
const mockEnvironmentCreate = jest.fn();
const mockLocationCreate = jest.fn();
const mockFallCreate = jest.fn();

const mockUserFindById = jest.fn();
const mockSendEmergencySMS = jest.fn();
const mockSendEmergencyWhatsApp = jest.fn();

jest.mock("../models/Device", () => ({
  findOne: mockDeviceFindOne,
  create: mockDeviceCreate,
  findOneAndUpdate: mockDeviceFindOneAndUpdate,
}));

jest.mock("../models/DevicePairing", () => ({
  create: mockDevicePairingCreate,
  findOne: mockDevicePairingFindOne,
  findOneAndUpdate: mockDevicePairingFindOneAndUpdate,
  updateOne: mockDevicePairingUpdateOne,
}));

jest.mock("../models/VitalsReading", () => ({
  create: mockVitalsCreate,
  findOne: jest.fn(),
  find: jest.fn(),
}));

jest.mock("../models/EnvironmentReading", () => ({
  create: mockEnvironmentCreate,
  findOne: jest.fn(),
  find: jest.fn(),
  aggregate: jest.fn(),
}));

jest.mock("../models/LocationReading", () => ({
  create: mockLocationCreate,
  findOne: jest.fn(),
  find: jest.fn(),
}));

jest.mock("../models/FallEvent", () => ({
  create: mockFallCreate,
  findOne: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findById: mockUserFindById,
}));

jest.mock("../services/smsService", () => ({
  sendEmergencySMS: mockSendEmergencySMS,
}));

jest.mock("../services/whatsappService", () => ({
  sendEmergencyWhatsApp: mockSendEmergencyWhatsApp,
}));

// Mock authentication for device pairing tests.
jest.mock("../middleware/authMiddleware", () => {
  return (req, res, next) => {
    req.userId = "507f1f77bcf86cd799439011";
    next();
  };
});

const { app } = require("../app");

describe("TrailGuard Backend API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        username: "Test User",
        emergencyContactName: "Emergency Contact",
        emergencyContactPhone: null,
      }),
    });

    mockSendEmergencySMS.mockResolvedValue({
      success: true,
      sid: "test-sms-sid",
    });

    mockSendEmergencyWhatsApp.mockResolvedValue({
      success: true,
      sid: "test-whatsapp-sid",
    });
  });

  // ─────────────────────────────────────────────
  // Health check
  // ─────────────────────────────────────────────

  describe("GET /", () => {
    test("returns backend status", async () => {
      const response = await request(app).get("/");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: "TrailGuard backend running",
      });
    });
  });

  // ─────────────────────────────────────────────
  // Device registration
  // ─────────────────────────────────────────────

  describe("Legacy device registration", () => {
    test.each(["/api/device/register", "/api/devices/register"])(
      "rejects ID-only claims at %s",
      async (path) => {
        const response = await request(app).post(path).send({
          deviceId: "TG-000001",
        });

        expect(response.statusCode).toBe(410);
        expect(response.body.error).toMatch(/ID-only device registration is disabled/);
        expect(mockDeviceCreate).not.toHaveBeenCalled();
      },
    );
  });

  describe("Secure device pairing", () => {
    const deviceId = "b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a";
    const userId = "507f1f77bcf86cd799439011";
    const bootstrapToken = crypto.randomBytes(32).toString("base64url");
    let privateKey;
    let publicKey;

    beforeEach(() => {
      ({ privateKey, publicKey } = crypto.generateKeyPairSync("ed25519"));
      mockDeviceFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          deviceId: deviceId.toUpperCase(),
          state: "PROVISIONED",
          bootstrapTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
          bootstrapTokenHash: crypto
            .createHash("sha256")
            .update(bootstrapToken)
            .digest("hex"),
          publicKey: publicKey.export({ type: "spki", format: "pem" }),
        }),
      });
    });

    test("rejects a device ID without a one-time pairing token", async () => {
      const response = await request(app)
        .post("/api/devices/pairing-challenges")
        .send({ deviceId });

      expect(response.statusCode).toBe(400);
      expect(mockDevicePairingCreate).not.toHaveBeenCalled();
    });

    test("rejects a token that does not match the provisioned device", async () => {
      const response = await request(app)
        .post("/api/devices/pairing-challenges")
        .send({
          deviceId,
          bootstrapToken: crypto.randomBytes(32).toString("base64url"),
        });

      expect(response.statusCode).toBe(404);
      expect(mockDevicePairingCreate).not.toHaveBeenCalled();
    });

    test("issues an expiring challenge without exposing stored credentials", async () => {
      const response = await request(app)
        .post("/api/devices/pairing-challenges")
        .send({ deviceId, bootstrapToken });

      expect(response.statusCode).toBe(201);
      expect(response.body.nonce).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(response.body.userId).toBe(userId);
      expect(Date.parse(response.body.expiresAt)).toBeGreaterThan(Date.now());
      expect(mockDeviceFindOne).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: deviceId.toUpperCase(),
          state: "PROVISIONED",
          bootstrapTokenExpiresAt: expect.objectContaining({ $gt: expect.any(Date) }),
        }),
      );
      expect(mockDevicePairingCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: deviceId.toUpperCase(),
          userId,
          state: "PENDING",
          purgeAt: expect.any(Date),
          bootstrapTokenHash: crypto
            .createHash("sha256")
            .update(bootstrapToken)
            .digest("hex"),
        }),
      );
      expect(response.body).not.toHaveProperty("bootstrapToken");
    });

    test("pairs only after a valid Ed25519 proof and atomically consumes the claim", async () => {
      const session = {
        withTransaction: jest.fn(async (callback) => callback()),
        endSession: jest.fn().mockResolvedValue(undefined),
      };
      const startSession = jest
        .spyOn(mongoose, "startSession")
        .mockResolvedValue(session);
      const expiresAt = new Date(Date.now() + 60_000);
      const nonce = crypto.randomBytes(32).toString("base64url");
      const challenge = {
        _id: "challenge-document",
        challengeId: crypto.randomUUID(),
        deviceId: deviceId.toUpperCase(),
        userId,
        nonceHash: crypto.createHash("sha256").update(nonce).digest("hex"),
        bootstrapTokenHash: crypto
          .createHash("sha256")
          .update(bootstrapToken)
          .digest("hex"),
        expiresAt,
        attempts: 0,
        state: "PENDING",
      };
      const message = JSON.stringify({
        challengeId: challenge.challengeId,
        deviceId: challenge.deviceId,
        userId,
        nonce,
        expiresAt: expiresAt.toISOString(),
      });
      const signature = crypto
        .sign(null, Buffer.from(message), privateKey)
        .toString("base64url");

      mockDevicePairingFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(challenge),
      });
      mockDevicePairingFindOneAndUpdate.mockResolvedValue(challenge);
      mockDeviceFindOneAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          deviceId: challenge.deviceId,
          deviceName: "TrailGuard Wearable",
          state: "PAIRED",
          status: "active",
        }),
      });

      const response = await request(app)
        .post(`/api/devices/pairing-challenges/${challenge.challengeId}/complete`)
        .send({ nonce, signature });

      expect(response.statusCode).toBe(200);
      expect(response.body.device.state).toBe("PAIRED");
      expect(mockDevicePairingFindOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: challenge._id,
          userId,
          state: "PENDING",
          expiresAt: expect.objectContaining({ $gt: expect.any(Date) }),
        }),
        { $set: { state: "CONSUMED", consumedAt: expect.any(Date) } },
        { new: false, session },
      );
      expect(mockDeviceFindOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: challenge.deviceId,
          state: "PROVISIONED",
          userId: null,
          bootstrapTokenHash: challenge.bootstrapTokenHash,
          bootstrapTokenExpiresAt: expect.objectContaining({ $gt: expect.any(Date) }),
        }),
        expect.objectContaining({
          $set: { state: "PAIRED", userId, status: "active" },
          $unset: {
            bootstrapTokenHash: 1,
            bootstrapTokenExpiresAt: 1,
          },
        }),
        { new: true, runValidators: true, session },
      );
      expect(startSession).toHaveBeenCalledTimes(1);
      expect(session.withTransaction).toHaveBeenCalledTimes(1);
      expect(session.endSession).toHaveBeenCalledTimes(1);
      startSession.mockRestore();
    });

    test("rejects expired challenges", async () => {
      const challenge = {
        _id: "expired-challenge",
        expiresAt: new Date(Date.now() - 1),
        state: "PENDING",
      };
      mockDevicePairingFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(challenge),
      });

      const response = await request(app)
        .post(`/api/devices/pairing-challenges/${crypto.randomUUID()}/complete`)
        .send({
          nonce: crypto.randomBytes(32).toString("base64url"),
          signature: Buffer.alloc(64).toString("base64url"),
        });

      expect(response.statusCode).toBe(410);
      expect(mockDevicePairingUpdateOne).toHaveBeenCalledWith(
        { _id: challenge._id, state: "PENDING" },
        { $set: { state: "EXPIRED" } },
      );
      expect(mockDeviceFindOneAndUpdate).not.toHaveBeenCalled();
    });

    test("rejects invalid signatures without assigning ownership", async () => {
      const expiresAt = new Date(Date.now() + 60_000);
      const nonce = crypto.randomBytes(32).toString("base64url");
      const challenge = {
        _id: "invalid-proof",
        challengeId: crypto.randomUUID(),
        deviceId: deviceId.toUpperCase(),
        userId,
        nonceHash: crypto.createHash("sha256").update(nonce).digest("hex"),
        bootstrapTokenHash: crypto
          .createHash("sha256")
          .update(bootstrapToken)
          .digest("hex"),
        expiresAt,
        attempts: 0,
        state: "PENDING",
      };
      mockDevicePairingFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(challenge),
      });

      const response = await request(app)
        .post(`/api/devices/pairing-challenges/${challenge.challengeId}/complete`)
        .send({ nonce, signature: Buffer.alloc(64).toString("base64url") });

      expect(response.statusCode).toBe(401);
      expect(mockDevicePairingFindOneAndUpdate).toHaveBeenCalled();
      expect(mockDeviceFindOneAndUpdate).not.toHaveBeenCalled();
    });

    test("locks a challenge after five invalid signature attempts", async () => {
      const challenge = {
        _id: "locked-challenge",
        challengeId: crypto.randomUUID(),
        userId,
        state: "PENDING",
        attempts: 5,
        expiresAt: new Date(Date.now() + 60_000),
      };
      mockDevicePairingFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(challenge),
      });

      const response = await request(app)
        .post(`/api/devices/pairing-challenges/${challenge.challengeId}/complete`)
        .send({
          nonce: crypto.randomBytes(32).toString("base64url"),
          signature: Buffer.alloc(64).toString("base64url"),
        });

      expect(response.statusCode).toBe(429);
      expect(mockDeviceFindOne).not.toHaveBeenCalled();
      expect(mockDevicePairingFindOneAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe("Device lifecycle management", () => {
    test("unpairs only caller-owned paired or legacy devices", async () => {
      const deviceId = "B3FDc7e3-995b-4f32-9d37-c8aaf9bb9f2a";
      mockDeviceFindOneAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app).delete(`/api/devices/${deviceId}`);

      expect(response.statusCode).toBe(404);
      expect(mockDeviceFindOneAndUpdate).toHaveBeenCalledWith(
        {
          deviceId: deviceId.toUpperCase(),
          userId: "507f1f77bcf86cd799439011",
          $or: [{ state: "PAIRED" }, { state: { $exists: false } }],
        },
        {
          $set: {
            status: "inactive",
            state: "PROVISIONED",
            userId: null,
          },
        },
        expect.objectContaining({ new: true }),
      );
    });
  });

  // ─────────────────────────────────────────────
  // Device telemetry
  // ─────────────────────────────────────────────

  describe("POST /api/device/readings", () => {
    test("requires deviceId", async () => {
      const response = await request(app).post("/api/device/readings").send({
        heartRate: 84,
        spo2: 99,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("deviceId is required");
    });

    test("rejects unknown device", async () => {
      mockDeviceFindOne.mockResolvedValue(null);

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-999999",
        heartRate: 84,
        spo2: 99,
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("Unknown or inactive device");
      expect(mockVitalsCreate).not.toHaveBeenCalled();
    });

    test("creates vitals reading using userId from device", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        lastSeen: null,
        save,
      });

      mockVitalsCreate.mockResolvedValue({
        _id: "reading-001",
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        heartRate: 78,
        spo2: 98,
        irSamples: [],
      });

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        heartRate: 78,
        spo2: 98,
      });

      expect(response.statusCode).toBe(201);
      expect(mockVitalsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: "TG-000001",
          userId: "507f1f77bcf86cd799439011",
          heartRate: 78,
          spo2: 98,
          irSamples: [],
        }),
      );

      expect(save).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
      expect(response.body.device.deviceId).toBe("TG-000001");
      expect(response.body.device.userId).toBe("507f1f77bcf86cd799439011");
    });

    test("creates environment reading", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        save,
      });

      mockEnvironmentCreate.mockResolvedValue({
        _id: "environment-001",
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        temperature: 21.4,
        humidity: 50.5,
      });

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        temperature: 21.4,
        humidity: 50.5,
      });

      expect(response.statusCode).toBe(201);
      expect(mockEnvironmentCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: "TG-000001",
          userId: "507f1f77bcf86cd799439011",
          temperature: 21.4,
          humidity: 50.5,
        }),
      );
      expect(save).toHaveBeenCalled();
    });

    test("creates location reading", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        save,
      });

      mockLocationCreate.mockResolvedValue({
        _id: "location-001",
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        latitude: 20.2961,
        longitude: 85.8245,
      });

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        latitude: 20.2961,
        longitude: 85.8245,
      });

      expect(response.statusCode).toBe(201);
      expect(mockLocationCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: "TG-000001",
          userId: "507f1f77bcf86cd799439011",
          latitude: 20.2961,
          longitude: 85.8245,
        }),
      );
      expect(save).toHaveBeenCalled();
    });

    test("creates fall event", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        save,
      });

      mockFallCreate.mockResolvedValue({
        _id: "fall-001",
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        fallDetected: true,
        severity: "severe",
      });

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        fallDetected: true,
        accelX: 1.2,
        accelY: 2.1,
        accelZ: 3.2,
        tiltAngle: 75,
        totalAcceleration: 4.1,
        severity: "severe",
        latitude: 20.2961,
        longitude: 85.8245,
      });

      expect(response.statusCode).toBe(201);
      expect(mockFallCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: "TG-000001",
          userId: "507f1f77bcf86cd799439011",
          severity: "severe",
          status: "detected",
        }),
      );

      expect(save).toHaveBeenCalled();
    });

    test("does not trust userId from device JSON", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        save,
      });

      mockVitalsCreate.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        heartRate: 84,
        spo2: 99,
      });

      await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        userId: "FAKE-USER-ID",
        heartRate: 84,
        spo2: 99,
      });

      expect(mockVitalsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "507f1f77bcf86cd799439011",
        }),
      );

      expect(mockVitalsCreate).not.toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "FAKE-USER-ID",
        }),
      );
    });

    test("rejects incomplete vitals data", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        save,
      });

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        heartRate: 84,
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.error).toBe(
        "heartRate and spo2 must be provided together",
      );

      expect(mockVitalsCreate).not.toHaveBeenCalled();
    });

    test("rejects incomplete environment data", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        save,
      });

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        temperature: 21.4,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        "temperature and humidity must be provided together",
      );
      expect(mockEnvironmentCreate).not.toHaveBeenCalled();
    });

    test("rejects incomplete location data", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        save,
      });

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        latitude: 20.2961,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        "latitude and longitude must be provided together",
      );
      expect(mockLocationCreate).not.toHaveBeenCalled();
    });

    test("rejects invalid timestamp", async () => {
      const save = jest.fn();

      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
        save,
      });

      const response = await request(app).post("/api/device/readings").send({
        deviceId: "TG-000001",
        timestamp: "invalid-date",
        heartRate: 84,
        spo2: 99,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Invalid timestamp");
      expect(mockVitalsCreate).not.toHaveBeenCalled();
    });
  });
});
