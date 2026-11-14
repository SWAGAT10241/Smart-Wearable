const crypto = require("crypto");
const mongoose = require("mongoose");
const Device = require("../models/Device");
const DevicePairing = require("../models/DevicePairing");
const {
  assertDeviceAuthorizationConfigured,
  issueDeviceAuthorizationReceipt,
  TELEMETRY_SESSION_LEASE_SECONDS,
} = require("./deviceAuthorizationReceiptService");
const AppError = require("../utils/appError");

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

/**
 * Initiate an expiring cryptographic pairing challenge.
 *
 * @param {object} params
 * @param {string} params.deviceId - UUID of target device
 * @param {string} params.bootstrapToken - One-time bootstrap secret
 * @param {string|mongoose.Types.ObjectId} params.userId - Authenticated user initiating pairing
 * @returns {Promise<{challengeId: string, deviceId: string, userId: string, nonce: string, expiresAt: string}>}
 */
async function createPairingChallenge({ deviceId, bootstrapToken, userId }) {
  if (
    typeof deviceId !== "string" ||
    !DEVICE_ID_PATTERN.test(deviceId.trim()) ||
    typeof bootstrapToken !== "string" ||
    !/^[A-Za-z0-9_-]{43}$/.test(bootstrapToken)
  ) {
    throw new AppError("A valid deviceId and pairing token are required", 400, "VALIDATION_ERROR");
  }

  const normalizedDeviceId = deviceId.trim().toUpperCase();

  try {
    assertDeviceAuthorizationConfigured();
  } catch (error) {
    console.error("Device authorization signing is unavailable:", error);
    throw new AppError("Secure device authorization is temporarily unavailable", 503, "SERVICE_UNAVAILABLE");
  }

  const bootstrapTokenHash = hash(bootstrapToken);
  const now = new Date();

  const device = await Device.findOne({
    deviceId: normalizedDeviceId,
    state: "PROVISIONED",
    bootstrapTokenExpiresAt: { $gt: now },
  }).select("+bootstrapTokenHash +bootstrapTokenExpiresAt");

  if (!device || !safeHashEquals(device.bootstrapTokenHash, bootstrapTokenHash)) {
    throw new AppError("Pairing details are invalid or the device is unavailable", 404, "DEVICE_NOT_FOUND");
  }

  const challengeId = crypto.randomUUID();
  const nonce = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + PAIRING_CHALLENGE_TTL_MS);
  const purgeAt = new Date(expiresAt.getTime() + 24 * 60 * 60 * 1000);

  await DevicePairing.create({
    challengeId,
    deviceId: normalizedDeviceId,
    userId,
    bootstrapTokenHash,
    nonceHash: hash(nonce),
    state: "PENDING",
    expiresAt,
    purgeAt,
  });

  return {
    challengeId,
    deviceId: normalizedDeviceId,
    userId: String(userId),
    nonce,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Verify device proof and atomically complete device claim transaction.
 *
 * @param {object} params
 * @param {string} params.challengeId
 * @param {string} params.nonce
 * @param {string} params.signature
 * @param {string|mongoose.Types.ObjectId} params.userId
 * @returns {Promise<{success: boolean, device: object, receipt: string}>}
 */
async function completePairingChallenge({ challengeId, nonce, signature, userId }) {
  if (
    !/^[0-9a-f-]{36}$/i.test(challengeId) ||
    typeof nonce !== "string" ||
    !/^[A-Za-z0-9_-]{43}$/.test(nonce) ||
    typeof signature !== "string" ||
    !/^[A-Za-z0-9_-]{86}$/.test(signature)
  ) {
    throw new AppError("Invalid pairing proof", 400, "VALIDATION_ERROR");
  }

  const now = new Date();
  const challenge = await DevicePairing.findOne({
    challengeId,
    userId,
    state: "PENDING",
  }).select("+nonceHash +bootstrapTokenHash");

  if (!challenge) {
    throw new AppError("Pairing challenge not found", 404, "CHALLENGE_NOT_FOUND");
  }

  if (challenge.expiresAt <= now) {
    await DevicePairing.updateOne(
      { _id: challenge._id, state: "PENDING" },
      { $set: { state: "EXPIRED" } },
    );
    throw new AppError("Pairing challenge expired", 410, "CHALLENGE_EXPIRED");
  }

  if (challenge.attempts >= MAX_PAIRING_ATTEMPTS) {
    throw new AppError("Pairing challenge is locked", 429, "CHALLENGE_LOCKED");
  }

  if (!safeHashEquals(challenge.nonceHash, hash(nonce))) {
    throw new AppError("Invalid pairing proof", 401, "INVALID_PROOF");
  }

  const device = await Device.findOne({
    deviceId: challenge.deviceId,
    state: "PROVISIONED",
    bootstrapTokenExpiresAt: { $gt: now },
  }).select("+publicKey +bootstrapTokenHash +bootstrapTokenExpiresAt");

  if (!device || !safeHashEquals(device.bootstrapTokenHash, challenge.bootstrapTokenHash)) {
    throw new AppError("Device is no longer available for pairing", 409, "DEVICE_UNAVAILABLE");
  }

  const message = pairingMessage({
    challengeId,
    deviceId: challenge.deviceId,
    userId,
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
    throw new AppError("Invalid pairing proof", 401, "INVALID_SIGNATURE");
  }

  const pairingReceipt = issueDeviceAuthorizationReceipt({
    scope: "PAIR",
    deviceId: challenge.deviceId,
    userId,
    challengeId,
    nonce,
    leaseSeconds: 0,
  });

  const session = await mongoose.startSession();
  let pairedDevice;

  try {
    await session.withTransaction(async () => {
      const consumedChallenge = await DevicePairing.findOneAndUpdate(
        {
          _id: challenge._id,
          userId,
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
          $set: { state: "PAIRED", userId, status: "active" },
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
      throw new AppError(
        error.code === "PAIRING_CHALLENGE_CONFLICT"
          ? "Pairing challenge has already been used"
          : "Device is no longer available for pairing",
        409,
        error.code,
      );
    }
    throw error;
  } finally {
    await session.endSession();
  }

  return {
    success: true,
    device: {
      deviceId: pairedDevice.deviceId,
      deviceName: pairedDevice.deviceName,
      state: pairedDevice.state,
      status: pairedDevice.status,
    },
    receipt: pairingReceipt,
  };
}

/**
 * Issue a single-use authenticated telemetry session receipt for a paired device.
 *
 * @param {object} params
 * @param {string} params.deviceId
 * @param {string} params.challengeId
 * @param {string} params.nonce
 * @param {string|mongoose.Types.ObjectId} params.userId
 * @returns {Promise<{receipt: string}>}
 */
async function issueTelemetryReceipt({ deviceId, challengeId, nonce, userId }) {
  if (
    typeof deviceId !== "string" ||
    !DEVICE_ID_PATTERN.test(deviceId) ||
    typeof challengeId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(challengeId) ||
    typeof nonce !== "string" ||
    !/^[A-Za-z0-9_-]{43}$/.test(nonce)
  ) {
    throw new AppError("Invalid telemetry authorization challenge", 400, "VALIDATION_ERROR");
  }

  const normalizedDeviceId = deviceId.toUpperCase();
  const device = await Device.findOne({
    deviceId: normalizedDeviceId,
    userId,
    state: "PAIRED",
    status: "active",
  }).select("deviceId userId");

  if (!device) {
    throw new AppError("Paired device not found", 404, "DEVICE_NOT_FOUND");
  }

  try {
    const receipt = issueDeviceAuthorizationReceipt({
      scope: "TELEMETRY",
      deviceId: normalizedDeviceId,
      userId,
      challengeId,
      nonce,
      leaseSeconds: TELEMETRY_SESSION_LEASE_SECONDS,
    });
    return { receipt };
  } catch (error) {
    console.error("Telemetry receipt issuance error:", error);
    throw new AppError("Secure telemetry authorization is temporarily unavailable", 503, "SERVICE_UNAVAILABLE");
  }
}

module.exports = {
  createPairingChallenge,
  completePairingChallenge,
  issueTelemetryReceipt,
  safeHashEquals,
  hash,
  DEVICE_ID_PATTERN,
  PAIRING_CHALLENGE_TTL_MS,
  MAX_PAIRING_ATTEMPTS,
};

