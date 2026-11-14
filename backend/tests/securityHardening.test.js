process.env.NODE_ENV = "test";

const logger = require("../utils/logger");
const emergencySessionService = require("../services/emergencySessionService");
const EmergencySession = require("../models/EmergencySession");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const VitalsReading = require("../models/VitalsReading");
const EnvironmentReading = require("../models/EnvironmentReading");
const LocationReading = require("../models/LocationReading");
const FallEvent = require("../models/FallEvent");

jest.mock("../models/EmergencySession");
jest.mock("../models/AuditLog");
jest.mock("../models/User");
jest.mock("../models/VitalsReading");
jest.mock("../models/EnvironmentReading");
jest.mock("../models/LocationReading");
jest.mock("../models/FallEvent");
jest.mock("../realtime/socketManager", () => ({
  broadcastEmergencyEvent: jest.fn(),
}));

describe("Security Hardening & Privacy Controls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Structured Logger Redaction", () => {
    test("redacts sensitive fields and tokens", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      logger.info("User action occurred", {
        password: "SuperSecretPassword123!",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        heartRate: 110,
        spo2: 95,
        latitude: 20.2961,
        longitude: 85.8245,
        phoneNumber: "+15551234567",
        safeMeta: "public_action",
      });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const loggedString = consoleSpy.mock.calls[0][0];

      expect(loggedString).not.toContain("SuperSecretPassword123!");
      expect(loggedString).not.toContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      expect(loggedString).not.toContain("20.2961");
      expect(loggedString).not.toContain("85.8245");
      expect(loggedString).toContain('"password":"[REDACTED]"');
      expect(loggedString).toContain('"token":"[REDACTED]"');
      expect(loggedString).toContain('"latitude":"[REDACTED]"');
      expect(loggedString).toContain('"heartRate":"[REDACTED]"');
      expect(loggedString).toContain('"safeMeta":"public_action"');

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("Logger message redaction", () => {
    test.each(["production", "development"])("sanitizes all message forms in %s", (mode) => {
      const originalEnv = process.env.NODE_ENV;
      const log = jest.spyOn(console, "log").mockImplementation(() => {});
      process.env.NODE_ENV = mode;
      try {
        const message = "GET /live?token=query-secret&ticket=ticket-secret&%70assword=password-secret&latitude=coordinate-secret&safe=public Bearer bearer-secret";
        logger.info(message);
        logger.info({ password: "object-secret", url: message });
        logger.info(new Error(message), { nested: [message] });

        for (const [output] of log.mock.calls) {
          for (const secret of ["query-secret", "ticket-secret", "password-secret", "coordinate-secret", "bearer-secret", "object-secret"]) {
            expect(output).not.toContain(secret);
          }
          expect(output).toContain("[REDACTED]");
          expect(output).toContain("safe=public");
          if (mode === "production") expect(() => JSON.parse(output)).not.toThrow();
        }
        expect(log).toHaveBeenCalledTimes(3);
      } finally {
        process.env.NODE_ENV = originalEnv;
        log.mockRestore();
      }
    });
  });

  describe("Responder Assignment Role Enforcement", () => {
    test("rejects assigning an ordinary citizen as an emergency responder", async () => {
      const mockSession = {
        sessionId: "session-abc-123",
        status: "active",
        activeResponders: [],
      };

      EmergencySession.findOne.mockResolvedValue(mockSession);
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "citizen-user-id",
          username: "ordinary_citizen",
          role: "citizen",
        }),
      });

      const coordinatorUser = {
        _id: "coord-id",
        role: "coordinator",
      };

      await expect(
        emergencySessionService.assignOrJoinResponder(
          "session-abc-123",
          { responderId: "citizen-user-id" },
          coordinatorUser,
        ),
      ).rejects.toThrow(
        "Assigned user must possess responder, coordinator, or admin privileges",
      );
    });

    test("permits assigning a user with responder role", async () => {
      const saveMock = jest.fn().mockResolvedValue(undefined);
      const mockSession = {
        sessionId: "session-abc-123",
        status: "active",
        activeResponders: [],
        save: saveMock,
      };

      EmergencySession.findOne.mockResolvedValue(mockSession);
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "responder-user-id",
          username: "paramedic_dan",
          role: "responder",
        }),
      });

      const coordinatorUser = {
        _id: "coord-id",
        role: "coordinator",
      };

      const result = await emergencySessionService.assignOrJoinResponder(
        "session-abc-123",
        { responderId: "responder-user-id" },
        coordinatorUser,
      );

      expect(result.activeResponders.length).toBe(1);
      expect(result.activeResponders[0].responderId).toBe("responder-user-id");
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe("Fail-Closed Security Audit Logging", () => {
    test("aborts historical data retrieval and throws AUDIT_FAILURE if audit log write fails", async () => {
      const mockSession = {
        sessionId: "session-secure-999",
        userId: "victim-user-id",
        deviceId: "TG-DEVICE-1",
        status: "active",
        activeResponders: [{ responderId: "responder-id-1" }],
        historicalWindowStart: new Date(Date.now() - 2 * 60 * 60 * 1000),
      };

      EmergencySession.findOne.mockResolvedValue(mockSession);
      AuditLog.create.mockRejectedValue(new Error("Mongo network error / primary down"));

      const responderUser = {
        _id: "responder-id-1",
        role: "responder",
      };

      await expect(
        emergencySessionService.getHistoricalData(
          "session-secure-999",
          responderUser,
        ),
      ).rejects.toThrow("Security audit logging failed; operation aborted");

      // Verify that no health data was queried from collections
      expect(VitalsReading.find).not.toHaveBeenCalled();
      expect(EnvironmentReading.find).not.toHaveBeenCalled();
      expect(LocationReading.find).not.toHaveBeenCalled();
      expect(FallEvent.find).not.toHaveBeenCalled();
    });
  });
});

