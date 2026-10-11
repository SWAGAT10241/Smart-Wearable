const crypto = require("crypto");

const Device = require("../models/Device");
const DeviceAuthNonce = require("../models/DeviceAuthNonce");

const DEVICE_ID_PATTERN =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/;

const NONCE_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const SIGNATURE_PATTERN = /^[A-Za-z0-9_-]{86}$/;

const DEVICE_TIMESTAMP_SKEW_MS = 5 * 60 * 1000;

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function timingSafeStringEqual(left, right) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function reject(res, message = "Device authentication failed") {
  return res.status(401).json({
    error: message,
  });
}

async function deviceAuthMiddleware(req, res, next) {
  try {
    const deviceIdHeader = req.get("X-Device-ID");
    const timestampHeader = req.get("X-Device-Timestamp");
    const nonce = req.get("X-Device-Nonce");
    const signature = req.get("X-Device-Signature");

    if (
      typeof deviceIdHeader !== "string" ||
      typeof timestampHeader !== "string" ||
      typeof nonce !== "string" ||
      typeof signature !== "string"
    ) {
      return reject(res);
    }

    const deviceId = deviceIdHeader.trim().toUpperCase();

    if (!DEVICE_ID_PATTERN.test(deviceId)) {
      return reject(res);
    }

    if (!/^\d+$/.test(timestampHeader)) {
      return reject(res);
    }

    const timestamp = Number(timestampHeader);

    if (!Number.isSafeInteger(timestamp)) {
      return reject(res);
    }

    if (!NONCE_PATTERN.test(nonce)) {
      return reject(res);
    }

    if (!SIGNATURE_PATTERN.test(signature)) {
      return reject(res);
    }

    const now = Date.now();

    if (Math.abs(now - timestamp) > DEVICE_TIMESTAMP_SKEW_MS) {
      return reject(res, "Device timestamp is outside the accepted window");
    }

    if (!Buffer.isBuffer(req.rawBody)) {
      console.error("Device authentication requires the raw request body");

      return res.status(500).json({
        error: "Device authentication is unavailable",
      });
    }

    const device = await Device.findOne({
      deviceId,
      state: "PAIRED",
      status: "active",
    }).select("+publicKey deviceId deviceName state status userId keyVersion");

    if (!device) {
      return reject(res, "Unknown, unpaired, or inactive device");
    }

    if (!device.publicKey) {
      return reject(res);
    }

    const bodyHash = sha256(req.rawBody);

    const canonicalMessage = [
      "v1",
      req.method.toUpperCase(),
      req.originalUrl,
      deviceId,
      timestampHeader,
      nonce,
      bodyHash,
    ].join("\n");

    let publicKey;

    try {
      publicKey = crypto.createPublicKey(device.publicKey);
    } catch {
      return reject(res);
    }

    if (publicKey.asymmetricKeyType !== "ed25519") {
      return reject(res);
    }

    let decodedSignature;

    try {
      decodedSignature = Buffer.from(signature, "base64url");
    } catch {
      return reject(res);
    }

    if (decodedSignature.length !== 64) {
      return reject(res);
    }

    let validSignature = false;

    try {
      validSignature = crypto.verify(
        null,
        Buffer.from(canonicalMessage, "utf8"),
        publicKey,
        decodedSignature,
      );
    } catch {
      validSignature = false;
    }

    if (!validSignature) {
      return reject(res);
    }

    /*
     * The nonce is stored only after the signature has been verified.
     *
     * If another request tries to use the same nonce, the unique
     * constraint causes this operation to fail.
     */
    try {
      await DeviceAuthNonce.create({
        deviceId,
        nonceHash: sha256(nonce),
        expiresAt: new Date(now + DEVICE_TIMESTAMP_SKEW_MS),
      });
    } catch (error) {
      if (error?.code === 11000) {
        return reject(res, "Telemetry request has already been used");
      }

      throw error;
    }

    /*
     * Never trust userId from the telemetry body.
     * Ownership comes from the authenticated Device record.
     */
    req.device = device;
    req.deviceId = device.deviceId;
    req.userId = device.userId;

    next();
  } catch (error) {
    console.error("Device authentication error:", error);

    return res.status(500).json({
      error: "Device authentication failed",
    });
  }
}

module.exports = deviceAuthMiddleware;
module.exports.sha256 = sha256;
module.exports.timingSafeStringEqual = timingSafeStringEqual;
