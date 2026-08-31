process.env.NODE_ENV = "test";

const request = require("supertest");

const mockDeviceFindOne = jest.fn();
const mockDeviceCreate = jest.fn();

const mockVitalsCreate = jest.fn();
const mockEnvironmentCreate = jest.fn();
const mockLocationCreate = jest.fn();
const mockFallCreate = jest.fn();

jest.mock("../models/Device", () => ({
  findOne: mockDeviceFindOne,
  create: mockDeviceCreate,
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

// Mock authentication for device registration tests.
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

  describe("POST /api/device/register", () => {
    test("requires deviceId", async () => {
      const response = await request(app).post("/api/device/register").send({});

      expect(response.statusCode).toBe(400);

      expect(response.body.error).toBe("deviceId is required");

      expect(mockDeviceCreate).not.toHaveBeenCalled();
    });

    test("registers device for authenticated user", async () => {
      mockDeviceFindOne.mockResolvedValue(null);

      mockDeviceCreate.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
      });

      const response = await request(app).post("/api/device/register").send({
        deviceId: "TG-000001",
      });

      expect(response.statusCode).toBe(201);

      expect(mockDeviceFindOne).toHaveBeenCalledWith({
        deviceId: "TG-000001",
      });

      expect(mockDeviceCreate).toHaveBeenCalledWith({
        deviceId: "TG-000001",
        deviceName: "TrailGuard Wearable",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
      });

      expect(response.body.success).toBe(true);
    });

    test("normalizes deviceId to uppercase", async () => {
      mockDeviceFindOne.mockResolvedValue(null);

      mockDeviceCreate.mockResolvedValue({
        deviceId: "TRAILGUARD-DEMO-001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
      });

      const response = await request(app).post("/api/device/register").send({
        deviceId: " trailguard-demo-001 ",
      });

      expect(response.statusCode).toBe(201);

      expect(mockDeviceCreate).toHaveBeenCalledWith({
        deviceId: "TRAILGUARD-DEMO-001",
        deviceName: "TrailGuard Wearable",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
      });
    });

    test("rejects already registered device", async () => {
      mockDeviceFindOne.mockResolvedValue({
        deviceId: "TG-000001",
        userId: "507f1f77bcf86cd799439011",
        status: "active",
      });

      const response = await request(app).post("/api/device/register").send({
        deviceId: "TG-000001",
      });

      expect(response.statusCode).toBe(409);

      expect(response.body.error).toBe("Device already connected");

      expect(mockDeviceCreate).not.toHaveBeenCalled();
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
