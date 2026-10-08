const express = require("express");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const Device = require("../models/Device");
const DevicePairing = require("../models/DevicePairing");
const protect = require("../middleware/authMiddleware");

const PAIRING_CHALLENGE_TTL_MS = 5 * 60 * 1000;
const MAX_PAIRING_ATTEMPTS = 5;
const DEVICE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function safeHashEquals(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  return (
    leftBuffer.length === 32 &&
    rightBuffer.length === 32 &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function pairingMessage({ challengeId, deviceId, userId, nonce, expiresAt }) {
  return JSON.stringify({
    challengeId,
    deviceId,
    userId: String(userId),
    nonce,
    expiresAt: new Date(expiresAt).toISOString(),
  });
}

function userPairingLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    keyGenerator: (req) => String(req.userId),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many pairing attempts. Please try again later." },
  });
}

module.exports = function () {
  const router = express.Router();

  router.post("/pairing-challenges", protect, userPairingLimiter(), async (req, res) => {
    try {
      if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({ error: "A JSON object is required" });
      }
      const { deviceId, bootstrapToken } = req.body;

      if (
        typeof deviceId !== "string" ||
        !DEVICE_ID_PATTERN.test(deviceId.trim()) ||
        typeof bootstrapToken !== "string" ||
        !/^[A-Za-z0-9_-]{43}$/.test(bootstrapToken)
      ) {
        return res.status(400).json({
          error: "A valid deviceId and pairing token are required",
        });
      }

      const normalizedDeviceId = deviceId.trim().toUpperCase();
      const bootstrapTokenHash = hash(bootstrapToken);
      const now = new Date();
      const device = await Device.findOne({
        deviceId: normalizedDeviceId,
        state: "PROVISIONED",
        bootstrapTokenExpiresAt: { $gt: now },
      }).select("+bootstrapTokenHash +bootstrapTokenExpiresAt");
      if (!device || !safeHashEquals(device.bootstrapTokenHash, bootstrapTokenHash)) {
        return res.status(404).json({
          error: "Pairing details are invalid or the device is unavailable",
        });
      }

      const challengeId = crypto.randomUUID();
      const nonce = crypto.randomBytes(32).toString("base64url");
      const expiresAt = new Date(Date.now() + PAIRING_CHALLENGE_TTL_MS);
      const purgeAt = new Date(expiresAt.getTime() + 24 * 60 * 60 * 1000);
      await DevicePairing.create({
        challengeId,
        deviceId: normalizedDeviceId,
        userId: req.userId,
        bootstrapTokenHash,
        nonceHash: hash(nonce),
        state: "PENDING",
        expiresAt,
        purgeAt,
      });

      return res.status(201).json({
        challengeId,
        deviceId: normalizedDeviceId,
        userId: String(req.userId),
        nonce,
        expiresAt: expiresAt.toISOString(),
      });
    } catch (error) {
      console.error("POST /api/devices/pairing-challenges error:", error);

      return res.status(500).json({ error: "Failed to start device pairing" });
    }
  });

  router.post(
    "/pairing-challenges/:challengeId/complete",
    protect,
    userPairingLimiter(),
    async (req, res) => {
      try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
          return res.status(400).json({ error: "A JSON object is required" });
        }
        const { challengeId } = req.params;
        const { nonce, signature } = req.body;
        if (
          !/^[0-9a-f-]{36}$/i.test(challengeId) ||
          typeof nonce !== "string" ||
          !/^[A-Za-z0-9_-]{43}$/.test(nonce) ||
          typeof signature !== "string" ||
          !/^[A-Za-z0-9_-]{86}$/.test(signature)
        ) {
          return res.status(400).json({ error: "Invalid pairing proof" });
        }

        const now = new Date();
        const challenge = await DevicePairing.findOne({
          challengeId,
          userId: req.userId,
          state: "PENDING",
        }).select("+nonceHash +bootstrapTokenHash");
        if (!challenge) {
          return res.status(404).json({ error: "Pairing challenge not found" });
        }
        if (challenge.expiresAt <= now) {
          await DevicePairing.updateOne(
            { _id: challenge._id, state: "PENDING" },
            { $set: { state: "EXPIRED" } },
          );
          return res.status(410).json({ error: "Pairing challenge expired" });
        }
        if (challenge.attempts >= MAX_PAIRING_ATTEMPTS) {
          return res.status(429).json({ error: "Pairing challenge is locked" });
        }
        if (!safeHashEquals(challenge.nonceHash, hash(nonce))) {
          return res.status(401).json({ error: "Invalid pairing proof" });
        }

        const device = await Device.findOne({
          deviceId: challenge.deviceId,
          state: "PROVISIONED",
          bootstrapTokenExpiresAt: { $gt: now },
        }).select("+publicKey +bootstrapTokenHash +bootstrapTokenExpiresAt");
        if (
          !device ||
          !safeHashEquals(device.bootstrapTokenHash, challenge.bootstrapTokenHash)
        ) {
          return res.status(409).json({ error: "Device is no longer available for pairing" });
        }

        const message = pairingMessage({
          challengeId,
          deviceId: challenge.deviceId,
          userId: req.userId,
          nonce,
          expiresAt: challenge.expiresAt,
        });
        let validSignature = false;
        try {
          const publicKey = crypto.createPublicKey(device.publicKey);
          validSignature =
            publicKey.asymmetricKeyType === "ed25519" &&
            crypto.verify(
              null,
              Buffer.from(message),
              publicKey,
              Buffer.from(signature, "base64url"),
            );
        } catch {
          validSignature = false;
        }
        if (!validSignature) {
          await DevicePairing.findOneAndUpdate(
            { _id: challenge._id, state: "PENDING", attempts: { $lt: MAX_PAIRING_ATTEMPTS } },
            [
              {
                $set: {
                  attempts: { $add: ["$attempts", 1] },
                  state: {
                    $cond: [
                      { $gte: [{ $add: ["$attempts", 1] }, MAX_PAIRING_ATTEMPTS] },
                      "FAILED",
                      "$state",
                    ],
                  },
                },
              },
            ],
          );
          return res.status(401).json({ error: "Invalid pairing proof" });
        }

        const session = await mongoose.startSession();
        let pairedDevice;
        try {
          await session.withTransaction(async () => {
            const consumedChallenge = await DevicePairing.findOneAndUpdate(
              {
                _id: challenge._id,
                userId: req.userId,
                state: "PENDING",
                expiresAt: { $gt: now },
                nonceHash: challenge.nonceHash,
                attempts: { $lt: MAX_PAIRING_ATTEMPTS },
              },
              { $set: { state: "CONSUMED", consumedAt: now } },
              { new: false, session },
            );
            if (!consumedChallenge) {
              const conflict = new Error("PAIRING_CHALLENGE_CONFLICT");
              conflict.code = "PAIRING_CHALLENGE_CONFLICT";
              throw conflict;
            }

            pairedDevice = await Device.findOneAndUpdate(
              {
                deviceId: challenge.deviceId,
                state: "PROVISIONED",
                userId: null,
                bootstrapTokenHash: challenge.bootstrapTokenHash,
                bootstrapTokenExpiresAt: { $gt: now },
              },
              {
                $set: { state: "PAIRED", userId: req.userId, status: "active" },
                $unset: {
                  bootstrapTokenHash: 1,
                  bootstrapTokenExpiresAt: 1,
                },
              },
              { new: true, runValidators: true, session },
            ).select("deviceId deviceName state status");
            if (!pairedDevice) {
              const conflict = new Error("DEVICE_PAIRING_CONFLICT");
              conflict.code = "DEVICE_PAIRING_CONFLICT";
              throw conflict;
            }
          });
        } catch (error) {
          if (
            error.code === "PAIRING_CHALLENGE_CONFLICT" ||
            error.code === "DEVICE_PAIRING_CONFLICT"
          ) {
            return res.status(409).json({
              error:
                error.code === "PAIRING_CHALLENGE_CONFLICT"
                  ? "Pairing challenge has already been used"
                  : "Device is no longer available for pairing",
            });
          }
          throw error;
        } finally {
          await session.endSession();
        }

        return res.status(200).json({
          success: true,
          device: {
            deviceId: pairedDevice.deviceId,
            deviceName: pairedDevice.deviceName,
            state: pairedDevice.state,
            status: pairedDevice.status,
          },
        });
      } catch (error) {
        console.error("POST /api/devices/pairing-challenges/:challengeId/complete error:", error);
        return res.status(500).json({ error: "Failed to complete device pairing" });
      }
    },
  );

  router.post("/register", protect, (req, res) =>
    res.status(410).json({
      error: "ID-only device registration is disabled; use the secure pairing flow",
    }),
  );

  return router;
};
