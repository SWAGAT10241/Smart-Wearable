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
  });

  describe("RiskAssessment Model", () => {
    it("should separate risk assessment from confirmed emergency", () => {
      const assessment = new RiskAssessment({
        deviceId: "TG-DEVICE-002",
        riskLevel: "medium",
        category: "possible_fall",
        confidenceScore: 0.72,
        sensorSnapshot: {
          accelMagnitude: 3.4,
          tiltAngle: 65,
        },
      });

      expect(assessment.assessmentId).toBeDefined();
      expect(assessment.isEmergencyConfirmed).toBe(false);
      expect(assessment.riskLevel).toBe("medium");
      expect(assessment.category).toBe("possible_fall");
    });

    it("should support escalating to an emergency session", () => {
      const assessment = new RiskAssessment({
        deviceId: "TG-DEVICE-002",
        riskLevel: "critical",
        category: "possible_fall",
        confidenceScore: 0.95,
        isEmergencyConfirmed: true,
        emergencySessionId: "uuid-session-1234",
      });

      expect(assessment.isEmergencyConfirmed).toBe(true);
      expect(assessment.emergencySessionId).toBe("uuid-session-1234");
    });
  });

  describe("AuditLog Model", () => {
    it("should create audit log with actor and target resource", () => {
      const actorId = new mongoose.Types.ObjectId();
      const audit = new AuditLog({
        actorId,
        actorRole: "responder",
        action: "EMERGENCY_SESSION_ACCESSED",
        targetResource: "EmergencySession:uuid-session-1234",
        ipAddress: "192.168.1.1",
        metadata: { reason: "Responding to SOS alert" },
      });

      expect(audit.auditId).toBeDefined();
      expect(audit.actorRole).toBe("responder");
      expect(audit.action).toBe("EMERGENCY_SESSION_ACCESSED");
      expect(audit.targetResource).toBe("EmergencySession:uuid-session-1234");
    });
  });

  describe("Validate Middleware", () => {
    it("should pass when validator succeeds", () => {
      const validator = (data) => ({ value: { name: data.name.trim() } });
      const req = { body: { name: "  trailguard  " } };
      const res = {};
      const next = jest.fn();

      validate(validator, "body")(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.body.name).toBe("trailguard");
    });

    it("should return 400 when validator returns an error", () => {
      const validator = () => ({
        error: { message: "Invalid deviceId" },
      });
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validate(validator, "body")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Validation error",
          message: "Invalid deviceId",
        }),
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
