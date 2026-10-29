const asyncHandler = require("../utils/asyncHandler");
const devicePairingService = require("../services/devicePairingService");
const AppError = require("../utils/appError");

/**
 * Controller handling device pairing challenge initialization.
 * POST /api/devices/pairing-challenges
 */
const startPairingChallenge = asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new AppError("A JSON object is required", 400, "INVALID_PAYLOAD");
  }

  const { deviceId, bootstrapToken } = req.body;
  const result = await devicePairingService.createPairingChallenge({
    deviceId,
    bootstrapToken,
    userId: req.userId,
  });

  res.status(201).json(result);
});

/**
 * Controller handling cryptographic proof submission and claim finalization.
 * POST /api/devices/pairing-challenges/:challengeId/complete
 */
const completePairingChallenge = asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new AppError("A JSON object is required", 400, "INVALID_PAYLOAD");
  }

  const { challengeId } = req.params;
  const { nonce, signature } = req.body;

  const result = await devicePairingService.completePairingChallenge({
    challengeId,
    nonce,
    signature,
    userId: req.userId,
  });

  res.status(200).json(result);
});

/**
 * Controller handling issuance of signed telemetry receipts for BLE sessions.
 * POST /api/devices/telemetry-receipts
 */
const getTelemetryReceipt = asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new AppError("A JSON object is required", 400, "INVALID_PAYLOAD");
  }

  const { deviceId, challengeId, nonce } = req.body;
  const result = await devicePairingService.issueTelemetryReceipt({
    deviceId,
    challengeId,
    nonce,
    userId: req.userId,
  });

  res.status(200).json(result);
});

/**
 * Legacy registration endpoint responder (disabled with 410 Gone).
 * POST /api/devices/register
 */
const rejectLegacyRegistration = (req, res) => {
  res.status(410).json({
    error: "ID-only device registration is disabled; use the secure pairing flow",
  });
};

module.exports = {
  startPairingChallenge,
  completePairingChallenge,
  getTelemetryReceipt,
  rejectLegacyRegistration,
};

