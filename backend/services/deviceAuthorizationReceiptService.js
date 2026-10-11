const crypto = require("crypto");

const TELEMETRY_SESSION_LEASE_SECONDS = 15 * 60;

function getAuthorityPrivateKey() {
  const configuredKey = process.env.DEVICE_AUTHORITY_PRIVATE_KEY;
  if (typeof configuredKey !== "string" || !configuredKey.trim()) {
    throw new Error("DEVICE_AUTHORITY_PRIVATE_KEY is required");
  }
  const privateKeyPem = configuredKey.replace(/\\n/g, "\n");
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  if (privateKey.asymmetricKeyType !== "ed25519") {
    throw new TypeError("DEVICE_AUTHORITY_PRIVATE_KEY must be an Ed25519 private key");
  }
  return privateKey;
}

function canonicalReceiptPayload(receipt) {
  return JSON.stringify({
    receiptVersion: receipt.receiptVersion,
    scope: receipt.scope,
    deviceId: receipt.deviceId,
    userId: receipt.userId,
    challengeId: receipt.challengeId,
    nonce: receipt.nonce,
    issuedAtUnixMs: receipt.issuedAtUnixMs,
    leaseSeconds: receipt.leaseSeconds,
  });
}

function issueDeviceAuthorizationReceipt({
  scope,
  deviceId,
  userId,
  challengeId,
  nonce,
  leaseSeconds,
  issuedAtUnixMs = Date.now(),
}) {
  if (scope !== "PAIR" && scope !== "TELEMETRY") {
    throw new TypeError("Unsupported device authorization receipt scope");
  }
  const receipt = {
    receiptVersion: 1,
    scope,
    deviceId,
    userId: String(userId),
    challengeId,
    nonce,
    issuedAtUnixMs,
    leaseSeconds,
  };
  const signature = crypto
    .sign(null, Buffer.from(canonicalReceiptPayload(receipt)), getAuthorityPrivateKey())
    .toString("base64url");
  return { ...receipt, signature };
}

function assertDeviceAuthorizationConfigured() {
  getAuthorityPrivateKey();
}

function verifyDeviceAuthorizationReceipt(receipt, publicKey) {
  const { signature, ...payload } = receipt;
  return crypto.verify(
    null,
    Buffer.from(canonicalReceiptPayload(payload)),
    publicKey,
    Buffer.from(signature, "base64url"),
  );
}

module.exports = {
  TELEMETRY_SESSION_LEASE_SECONDS,
  assertDeviceAuthorizationConfigured,
  canonicalReceiptPayload,
  issueDeviceAuthorizationReceipt,
  verifyDeviceAuthorizationReceipt,
};
