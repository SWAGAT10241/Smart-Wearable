const request = require("supertest");

const mockCreate = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();

jest.mock("../models/VitalsReading", () => ({
  create: mockCreate,
  findOne: mockFindOne,
  find: mockFind,
}));

const { app } = require("../app");

describe("Smart-Wearable Backend", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    test("returns backend status", async () => {
      const response = await request(app).get("/");

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({
        status: "TrailGuard backend running",
      });
    });
  });

  describe("POST /api/vitals", () => {
    test("rejects missing required fields", async () => {
      const response = await request(app).post("/api/vitals").send({
        deviceId: "ESP32-001",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.error).toBe(
        "deviceId, heartRate, and spo2 are required",
      );

      expect(mockCreate).not.toHaveBeenCalled();
    });

    test("creates a vitals reading", async () => {
      const reading = {
        _id: "reading-001",
        deviceId: "ESP32-001",
        heartRate: 78,
        spo2: 98,
      };

      mockCreate.mockResolvedValue(reading);

      const response = await request(app).post("/api/vitals").send({
        deviceId: "ESP32-001",
        heartRate: 78,
        spo2: 98,
      });

      expect(response.statusCode).toBe(201);

      expect(response.body).toEqual(reading);

      expect(mockCreate).toHaveBeenCalledWith({
        deviceId: "ESP32-001",
        heartRate: 78,
        spo2: 98,
        userId: undefined,
      });
    });
  });
});
describe("Smart-Wearable Backend", () => {
  test("backend test setup works", () => {
    expect(true).toBe(true);
  });
});
