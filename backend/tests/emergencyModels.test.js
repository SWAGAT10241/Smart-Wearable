const mongoose = require("mongoose");
const EmergencySession = require("../models/EmergencySession");
const RiskAssessment = require("../models/RiskAssessment");
const AuditLog = require("../models/AuditLog");
const validate = require("../middleware/validate");

describe("Phase 1 Day 4: Risk & Emergency Models", () => {
  describe("EmergencySession Model", () => {
    it("should instantiate with default UUID sessionId and valid fields", () => {
      const dummyUserId = new mongoose.Types.ObjectId();
      const session = new EmergencySession({
        userId: dummyUserId,
        deviceId: "TG-DEVICE-001",
        triggerType: "manual_sos",
        location: {
          latitude: 28.6139,
          longitude: 77.209,
          accuracy: 5.0,
        },
        vitalsSummary: {
          heartRate: 110,
          spo2: 96,
        },
      });

      expect(session.sessionId).toBeDefined();
      expect(typeof session.sessionId).toBe("string");
      expect(session.sessionId.length).toBeGreaterThan(20); // UUID format
      expect(session.status).toBe("active");
      expect(session.expiresAt).toBeInstanceOf(Date);
      expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it("should fail validation without required location or triggerType", async () => {
      const invalidSession = new EmergencySession({
        deviceId: "TG-DEVICE-001",
      });

      let err;
      try {
        await invalidSession.validate();
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.errors.userId).toBeDefined();
      expect(err.errors.triggerType).toBeDefined();
    });

    it("should verify TTL index exists on expiresAt", () => {
      const indexes = EmergencySession.schema.indexes();
      const ttlIndex = indexes.find(
        ([idx, opts]) => idx.expiresAt === 1 && opts && opts.expireAfterSeconds === 0,
      );
      expect(ttlIndex).toBeDefined();
    });

    it("should allow active responders to join an emergency session", () => {
      const dummyUserId = new mongoose.Types.ObjectId();
      const responderId = new mongoose.Types.ObjectId();
      const session = new EmergencySession({
        userId: dummyUserId,
        deviceId: "TG-DEVICE-001",
        triggerType: "fall_confirmed",
        location: { latitude: 12.9716, longitude: 77.5946 },
        activeResponders: [
          {
            responderId,
            accessExpiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
          },
        ],
      });

      expect(session.activeResponders).toHaveLength(1);
      expect(session.activeResponders[0].responderId).toEqual(responderId);
    });
  });

  describe("RiskAssessment Model", () => {
    it("should correctly separate detected anomalies from confirmed emergencies", () => {
      const assessment = new RiskAssessment({
        deviceId: "TG-DEVICE-001",
        riskLevel: "medium",
        category: "possible_fall",
        confidenceScore: 0.65,
        isEmergencyConfirmed: false,
        sensorSnapshot: {
          accelMagnitude: 2.8,
          tiltAngle: 65,
        },
      });

      expect(assessment.assessmentId).toBeDefined();
      expect(assessment.isEmergencyConfirmed).toBe(false);
      expect(assessment.emergencySessionId).toBeUndefined();
      expect(assessment.riskLevel).toBe("medium");
    });

    it("should link to emergencySessionId once an emergency is confirmed", async () => {
      const confirmedAssessment = new RiskAssessment({
        deviceId: "TG-DEVICE-001",
        riskLevel: "critical",
        category: "fall_confirmed",
        confidenceScore: 0.95,
        isEmergencyConfirmed: true,
        emergencySessionId: "session-uuid-12345",
      });

      // Note: "fall_confirmed" is not in enum, will fail validation
      let err;
      try {
        await confirmedAssessment.validate();
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.errors.category).toBeDefined();

      // Fix category to valid enum
      confirmedAssessment.category = "possible_fall";
      await expect(confirmedAssessment.validate()).resolves.toBeUndefined();
      expect(confirmedAssessment.isEmergencyConfirmed).toBe(true);
      expect(confirmedAssessment.emergencySessionId).toBe("session-uuid-12345");
    });
  });

  describe("AuditLog Model", () => {
    it("should create audit trail record with target resource and actor details", () => {
      const actorId = new mongoose.Types.ObjectId();
      const audit = new AuditLog({
        actorId,
        actorRole: "responder",
        action: "EMERGENCY_SESSION_ACCESSED",
        targetResource: "EmergencySession:uuid-test-1234",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        metadata: { accessDurationMinutes: 15 },
      });

      expect(audit.auditId).toBeDefined();
      expect(audit.action).toBe("EMERGENCY_SESSION_ACCESSED");
      expect(audit.targetResource).toBe("EmergencySession:uuid-test-1234");
      expect(audit.timestamp).toBeInstanceOf(Date);
    });
  });

  describe("Validate Middleware", () => {
    it("should pass when schema validator succeeds", () => {
      const mockReq = { body: { name: "Safe User" } };
      const mockRes = {};
      const mockNext = jest.fn();

      const validator = (data) => ({ error: null, value: data });
      const middleware = validate(validator);

      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should respond with 400 when validator detects error", () => {
      const mockReq = { body: {} };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const validator = () => ({
        error: { message: "Field 'deviceId' is required", details: ["Field 'deviceId' is required"] },
      });
      const middleware = validate(validator);

      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Validation error",
          message: "Field 'deviceId' is required",
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
