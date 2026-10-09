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

const mockDeviceAuthNonceCreate = jest.fn();

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

jest.mock("../models/DeviceAuthNonce", () => ({
  create: mockDeviceAuthNonceCreate,
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

// Mock authentication for user-protected routes.
jest.mock("../middleware/authMiddleware", () => {
  return (req, res, next) => {
    req.userId = "507f1f77bcf86cd799439011";
    next();
  };
});

const { app } = require("../app");
const {
  verifyDeviceAuthorizationReceipt,
} = require("../services/deviceAuthorizationReceiptService");

describe("TrailGuard Backend API", () => {
  /*
   * Test device identity used by telemetry tests.
   *
   * The production device uses an Ed25519 keypair.
   * We reproduce that behavior here.
   */
  const telemetryDeviceId = "550e8400-e29b-41d4-a716-446655440000";
  const telemetryUserId = "507f1f77bcf86cd799439011";

  let telemetryPrivateKey;
  let telemetryPublicKey;

  /*
   * Generate a fresh Ed25519 keypair for the telemetry test device.
   */
  function generateTelemetryKeyPair() {
    const keyPair = crypto.generateKeyPairSync("ed25519");

    telemetryPrivateKey = keyPair.privateKey;
    telemetryPublicKey = keyPair.publicKey.export({
      type: "spki",
      format: "pem",
    });
  }

  /*
   * Create the same SHA-256 hash used by deviceAuthMiddleware.
   */
  function sha256(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
  }

  /*
   * Prepare the mocked Device document returned by the
   * authentication middleware.
   *
   * deviceAuthMiddleware calls:
   *
   * Device.findOne(...).select(...)
   *
   * so the mock must expose select().
   */
  function mockAuthenticatedTelemetryDevice() {
    const save = jest.fn().mockResolvedValue(undefined);

    const device = {
      deviceId: telemetryDeviceId.toUpperCase(),
      deviceName: "Test Wearable",
      state: "PAIRED",
      status: "active",
      userId: telemetryUserId,
      keyVersion: 1,
      publicKey: telemetryPublicKey,
      lastSeen: null,
      save,
    };

    mockDeviceFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(device),
    });

    return device;
  }

  /*
   * Create authenticated telemetry headers.
   *
   * IMPORTANT:
   * The middleware signs:
   *
   * v1
   * POST
   * /api/device/readings
   * DEVICE_ID
   * TIMESTAMP
   * NONCE
   * SHA256(RAW_BODY)
   *
   * Therefore we sign the exact JSON string that is sent to
   * Supertest.
   */
  function createDeviceAuthHeaders(body) {
    const rawBody = Buffer.from(JSON.stringify(body), "utf8");
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(32).toString("base64url");
    const bodyHash = sha256(rawBody);

    const canonicalMessage = [
      "v1",
      "POST",
      "/api/device/readings",
      telemetryDeviceId.toUpperCase(),
      timestamp,
      nonce,
      bodyHash,
    ].join("\n");

    const signature = crypto
      .sign(null, Buffer.from(canonicalMessage, "utf8"), telemetryPrivateKey)
      .toString("base64url");

    return {
      "X-Device-ID": telemetryDeviceId.toUpperCase(),
      "X-Device-Timestamp": timestamp,
      "X-Device-Nonce": nonce,
      "X-Device-Signature": signature,
    };
  }

  /*
   * Send authenticated telemetry.
   *
   * We deliberately send JSON.stringify(body) instead of
   * .send(body), because the signature is calculated over
   * the exact raw request body.
   */
  function authenticatedTelemetryRequest(body) {
    const rawBody = JSON.stringify(body);
    const headers = createDeviceAuthHeaders(body);

    return request(app)
      .post("/api/device/readings")
      .set(headers)
      .set("Content-Type", "application/json")
      .send(rawBody);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    generateTelemetryKeyPair();
    mockDeviceAuthNonceCreate.mockResolvedValue({
      deviceId: telemetryDeviceId.toUpperCase(),
    });

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
        expect(response.body.error).toMatch(
          /ID-only device registration is disabled/,
        );

        expect(mockDeviceCreate).not.toHaveBeenCalled();
      },
    );
  });

  // ─────────────────────────────────────────────
  // Secure device pairing
  // ─────────────────────────────────────────────

  describe("Secure device pairing", () => {
    const deviceId = "b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a";
    const userId = "507f1f77bcf86cd799439011";
    const bootstrapToken = crypto.randomBytes(32).toString("base64url");

    let privateKey;
    let publicKey;
    let authorityPublicKey;

    beforeEach(() => {
      ({ privateKey, publicKey } = crypto.generateKeyPairSync("ed25519"));
      const authorityKeys = crypto.generateKeyPairSync("ed25519");
      authorityPublicKey = authorityKeys.publicKey;
      process.env.DEVICE_AUTHORITY_PRIVATE_KEY = authorityKeys.privateKey
        .export({ type: "pkcs8", format: "pem" })
        .toString();
      mockDeviceFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          deviceId: deviceId.toUpperCase(),
          state: "PROVISIONED",
          bootstrapTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
          bootstrapTokenHash: crypto
            .createHash("sha256")
            .update(bootstrapToken)
            .digest("hex"),
          publicKey: publicKey.export({
            type: "spki",
            format: "pem",
          }),
        }),
      });
    });

    test("rejects a device ID without a one-time pairing token", async () => {
      const response = await request(app)
        .post("/api/devices/pairing-challenges")
        .send({
          deviceId,
        });

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
        .send({
          deviceId,
          bootstrapToken,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.nonce).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(response.body.userId).toBe(userId);
      expect(Date.parse(response.body.expiresAt)).toBeGreaterThan(Date.now());

      expect(mockDeviceFindOne).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: deviceId.toUpperCase(),
          state: "PROVISIONED",
          bootstrapTokenExpiresAt: expect.objectContaining({
            $gt: expect.any(Date),
          }),
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
        .post(
          `/api/devices/pairing-challenges/${challenge.challengeId}/complete`,
        )
        .send({
          nonce,
          signature,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.device.state).toBe("PAIRED");
      expect(response.body.receipt).toMatchObject({
        receiptVersion: 1,
        scope: "PAIR",
        deviceId: challenge.deviceId,
        userId,
        challengeId: challenge.challengeId,
        nonce,
        leaseSeconds: 0,
      });
      expect(
        verifyDeviceAuthorizationReceipt(
          response.body.receipt,
          authorityPublicKey,
        ),
      ).toBe(true);
      expect(mockDevicePairingFindOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: challenge._id,
          userId,
          state: "PENDING",
          expiresAt: expect.objectContaining({
            $gt: expect.any(Date),
          }),
        }),
        {
          $set: {
            state: "CONSUMED",
            consumedAt: expect.any(Date),
          },
        },
        {
          new: false,
          session,
        },
      );

      expect(mockDeviceFindOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: challenge.deviceId,
          state: "PROVISIONED",
          userId: null,
          bootstrapTokenHash: challenge.bootstrapTokenHash,
          bootstrapTokenExpiresAt: expect.objectContaining({
            $gt: expect.any(Date),
          }),
        }),
        expect.objectContaining({
          $set: {
            state: "PAIRED",
            userId,
            status: "active",
          },

          $unset: {
            bootstrapTokenHash: 1,
            bootstrapTokenExpiresAt: 1,
          },
        }),
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      expect(startSession).toHaveBeenCalledTimes(1);
      expect(session.withTransaction).toHaveBeenCalledTimes(1);
      expect(session.endSession).toHaveBeenCalledTimes(1);
      startSession.mockRestore();
    });

    test("issues a short telemetry receipt only for the authenticated owner", async () => {
      const challengeId = crypto.randomUUID();
      const nonce = crypto.randomBytes(32).toString("base64url");
      mockDeviceFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          deviceId: deviceId.toUpperCase(),
          userId,
        }),
      });

      const response = await request(app)
        .post("/api/devices/telemetry-receipts")
        .send({ deviceId, challengeId, nonce });

      expect(response.statusCode).toBe(200);
      expect(mockDeviceFindOne).toHaveBeenCalledWith({
        deviceId: deviceId.toUpperCase(),
        userId,
        state: "PAIRED",
        status: "active",
      });
      expect(response.body.receipt).toMatchObject({
        receiptVersion: 1,
        scope: "TELEMETRY",
        deviceId: deviceId.toUpperCase(),
        userId,
        challengeId,
        nonce,
        leaseSeconds: 15 * 60,
      });
      expect(
        verifyDeviceAuthorizationReceipt(
          response.body.receipt,
          authorityPublicKey,
        ),
      ).toBe(true);
    });

    test("does not authorize a telemetry lease for another user's device", async () => {
      mockDeviceFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
      const response = await request(app)
        .post("/api/devices/telemetry-receipts")
        .send({
          deviceId,
          challengeId: crypto.randomUUID(),
          nonce: crypto.randomBytes(32).toString("base64url"),
        });
      expect(response.statusCode).toBe(404);
      expect(response.statusCode).toBe(404);
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
        {
          _id: challenge._id,
          state: "PENDING",
        },
        {
          $set: {
            state: "EXPIRED",
          },
        },
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
        .post(
          `/api/devices/pairing-challenges/${challenge.challengeId}/complete`,
        )
        .send({
          nonce,
          signature: Buffer.alloc(64).toString("base64url"),
        });

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
        .post(
          `/api/devices/pairing-challenges/${challenge.challengeId}/complete`,
        )
        .send({
          nonce: crypto.randomBytes(32).toString("base64url"),

          signature: Buffer.alloc(64).toString("base64url"),
        });

      expect(response.statusCode).toBe(429);
      expect(mockDeviceFindOne).not.toHaveBeenCalled();
      expect(mockDevicePairingFindOneAndUpdate).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // Device lifecycle management
  // ─────────────────────────────────────────────

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

          $or: [
            {
              state: "PAIRED",
            },
            {
              state: {
                $exists: false,
              },
            },
          ],
        },

        {
          $set: {
            status: "inactive",
            state: "PROVISIONED",
            userId: null,
          },
        },

        expect.objectContaining({
          new: true,
        }),
      );
    });
  });

  // ─────────────────────────────────────────────
  // Device telemetry
  // ─────────────────────────────────────────────

  describe("POST /api/device/readings", () => {
    test("rejects telemetry without device authentication", async () => {
      const response = await request(app).post("/api/device/readings").send({
        deviceId: telemetryDeviceId,
        heartRate: 84,
        spo2: 99,
      });

      expect(response.statusCode).toBe(401);
      expect(mockVitalsCreate).not.toHaveBeenCalled();
      expect(mockDeviceAuthNonceCreate).not.toHaveBeenCalled();
    });

    test("rejects unknown device", async () => {
      mockDeviceFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const body = {
        deviceId: telemetryDeviceId,
        heartRate: 84,
        spo2: 99,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("Unknown, unpaired, or inactive device");
      expect(mockVitalsCreate).not.toHaveBeenCalled();
    });

    test("creates vitals reading using userId from authenticated device", async () => {
      const device = mockAuthenticatedTelemetryDevice();

      mockVitalsCreate.mockResolvedValue({
        _id: "reading-001",
        deviceId: telemetryDeviceId.toUpperCase(),
        userId: telemetryUserId,
        heartRate: 78,
        spo2: 98,
        irSamples: [],
      });

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),
        heartRate: 78,
        spo2: 98,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(201);

      expect(mockVitalsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: telemetryDeviceId.toUpperCase(),
          userId: telemetryUserId,
          heartRate: 78,
          spo2: 98,
          irSamples: [],
        }),
      );

      expect(device.save).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
      expect(response.body.device.deviceId).toBe(telemetryDeviceId.toUpperCase(),);
      expect(response.body.device.userId).toBe(telemetryUserId);
      expect(mockDeviceAuthNonceCreate).toHaveBeenCalledTimes(1);
    });

    test("creates environment reading", async () => {
      const device = mockAuthenticatedTelemetryDevice();

      mockEnvironmentCreate.mockResolvedValue({
        _id: "environment-001",
        deviceId: telemetryDeviceId.toUpperCase(),
        userId: telemetryUserId,
        temperature: 21.4,
        humidity: 50.5,
      });

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),
        temperature: 21.4,
        humidity: 50.5,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(201);

      expect(mockEnvironmentCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: telemetryDeviceId.toUpperCase(),
          userId: telemetryUserId,
          temperature: 21.4,
          humidity: 50.5,
        }),
      );

      expect(device.save).toHaveBeenCalled();
    });

    test("creates location reading", async () => {
      const device = mockAuthenticatedTelemetryDevice();

      mockLocationCreate.mockResolvedValue({
        _id: "location-001",
        deviceId: telemetryDeviceId.toUpperCase(),
        userId: telemetryUserId,
        latitude: 20.2961,
        longitude: 85.8245,
      });

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),
        latitude: 20.2961,
        longitude: 85.8245,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(201);

      expect(mockLocationCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: telemetryDeviceId.toUpperCase(),
          userId: telemetryUserId,
          latitude: 20.2961,
          longitude: 85.8245,
        }),
      );

      expect(device.save).toHaveBeenCalled();
    });

    test("creates fall event", async () => {
      const device = mockAuthenticatedTelemetryDevice();

      mockFallCreate.mockResolvedValue({
        _id: "fall-001",
        deviceId: telemetryDeviceId.toUpperCase(),
        userId: telemetryUserId,
        fallDetected: true,
        severity: "severe",
      });

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),

        fallDetected: true,

        accelX: 1.2,
        accelY: 2.1,
        accelZ: 3.2,

        tiltAngle: 75,
        totalAcceleration: 4.1,

        severity: "severe",

        latitude: 20.2961,
        longitude: 85.8245,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(201);

      expect(mockFallCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: telemetryDeviceId.toUpperCase(),
          userId: telemetryUserId,
          severity: "severe",
          status: "detected",
        }),
      );

      expect(device.save).toHaveBeenCalled();
    });

    test("does not trust userId from device JSON", async () => {
      const device = mockAuthenticatedTelemetryDevice();

      mockVitalsCreate.mockResolvedValue({
        deviceId: telemetryDeviceId.toUpperCase(),
        userId: telemetryUserId,
        heartRate: 84,
        spo2: 99,
      });

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),
        userId: "FAKE-USER-ID",
        heartRate: 84,
        spo2: 99,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(201);
      expect(mockVitalsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: telemetryUserId,
        }),
      );

      expect(mockVitalsCreate).not.toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "FAKE-USER-ID",
        }),
      );

      expect(device.save).toHaveBeenCalled();
    });

    test("rejects incomplete vitals data", async () => {
      mockAuthenticatedTelemetryDevice();

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),
        heartRate: 84,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("heartRate and spo2 must be provided together",);
      expect(mockVitalsCreate).not.toHaveBeenCalled();
    });

    test("rejects incomplete environment data", async () => {
      mockAuthenticatedTelemetryDevice();

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),
        temperature: 21.4,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("temperature and humidity must be provided together",);
      expect(mockEnvironmentCreate).not.toHaveBeenCalled();
    });

    test("rejects incomplete location data", async () => {
      mockAuthenticatedTelemetryDevice();

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),

        latitude: 20.2961,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("latitude and longitude must be provided together",);
      expect(mockLocationCreate).not.toHaveBeenCalled();
    });

    test("rejects invalid timestamp", async () => {
      mockAuthenticatedTelemetryDevice();

      const body = {
        deviceId: telemetryDeviceId.toUpperCase(),
        timestamp: "invalid-date",
        heartRate: 84,
        spo2: 99,
      };

      const response = await authenticatedTelemetryRequest(body);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Invalid timestamp");
      expect(mockVitalsCreate).not.toHaveBeenCalled();
    });
  });
});
