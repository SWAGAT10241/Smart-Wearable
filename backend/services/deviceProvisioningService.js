const crypto = require("crypto");

const Device = require("../models/Device");

const BOOTSTRAP_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const DEVICE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateDeviceId(deviceId) {
  if (typeof deviceId !== "string" || !DEVICE_ID_PATTERN.test(deviceId.trim())) {
    throw new TypeError("deviceId must be a valid UUIDv4");
  }
  return deviceId.trim().toUpperCase();
}

function validatePublicKey(publicKeyPem) {
  if (
    typeof publicKeyPem !== "string" ||
    !publicKeyPem.startsWith("-----BEGIN PUBLIC KEY-----") ||
    !publicKeyPem.trimEnd().endsWith("-----END PUBLIC KEY-----")
  ) {
    throw new TypeError("public key must be an Ed25519 SPKI PEM public key");
  }

  let key;
  try {
    key = crypto.createPublicKey(publicKeyPem);
  } catch {
    throw new TypeError("public key must be a valid Ed25519 SPKI PEM public key");
  }
  if (key.asymmetricKeyType !== "ed25519") {
    throw new TypeError("public key must be Ed25519");
  }
  return key.export({ type: "spki", format: "pem" }).toString();
}

async function provisionDevice({
  deviceId,
  publicKeyPem,
  deviceName,
  prepareBootstrapToken,
}) {
  const normalizedDeviceId = validateDeviceId(deviceId);
  const publicKey = validatePublicKey(publicKeyPem);
  const normalizedDeviceName =
    typeof deviceName === "string" && deviceName.trim()
      ? deviceName.trim()
      : "TrailGuard Wearable";
  if (normalizedDeviceName.length > 50) {
    throw new TypeError("deviceName must be 50 characters or less");
  }

  const bootstrapToken = crypto.randomBytes(32).toString("base64url");
  const bootstrapTokenHash = crypto
    .createHash("sha256")
    .update(bootstrapToken)
    .digest("hex");
  const now = new Date();
  const bootstrapTokenExpiresAt = new Date(now.getTime() + BOOTSTRAP_TOKEN_TTL_MS);

  const cleanupPreparedToken = prepareBootstrapToken
    ? await prepareBootstrapToken({
        deviceId: normalizedDeviceId,
        bootstrapToken,
        expiresAt: bootstrapTokenExpiresAt.toISOString(),
      })
    : null;

  try {
    const reissuedToken = await Device.findOneAndUpdate(
      {
        deviceId: normalizedDeviceId,
        publicKey,
        state: "PROVISIONED",
        userId: null,
        $or: [
          { bootstrapTokenHash: { $exists: false } },
          { bootstrapTokenExpiresAt: { $lte: now } },
        ],
      },
      {
        $set: { bootstrapTokenHash, bootstrapTokenExpiresAt },
      },
      { new: true, runValidators: true },
    );

    if (!reissuedToken) {
      await Device.create({
        deviceId: normalizedDeviceId,
        deviceName: normalizedDeviceName,
        publicKey,
        keyVersion: 1,
        state: "PROVISIONED",
        bootstrapTokenHash,
        bootstrapTokenExpiresAt,
        userId: null,
        status: "inactive",
      });
    }
  } catch (error) {
    if (typeof cleanupPreparedToken === "function") {
      await cleanupPreparedToken();
    }
    throw error;
  }

  return {
    deviceId: normalizedDeviceId,
    bootstrapToken,
    expiresAt: bootstrapTokenExpiresAt.toISOString(),
  };
}

module.exports = {
  provisionDevice,
  validateDeviceId,
  validatePublicKey,
};
