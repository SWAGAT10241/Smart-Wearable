export const DEVICE_PAIRING_SERVICE_UUID =
  "6f2a0001-7b1c-4d90-a5e2-8c1d3f6a0001";
export const DEVICE_INFORMATION_CHARACTERISTIC_UUID =
  "6f2a0006-7b1c-4d90-a5e2-8c1d3f6a0001";
export const COMMAND_CHARACTERISTIC_UUID =
  "6f2a0003-7b1c-4d90-a5e2-8c1d3f6a0001";
export const AUTHORIZATION_CHARACTERISTIC_UUID =
  "6f2a0007-7b1c-4d90-a5e2-8c1d3f6a0001";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BOOTSTRAP_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function parsePairingQr(text) {
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("This QR code is not a valid TrailGuard pairing code.");
  }

  if (
    payload?.version !== 1 ||
    typeof payload.deviceId !== "string" ||
    !UUID_V4_PATTERN.test(payload.deviceId) ||
    typeof payload.bootstrapToken !== "string" ||
    !BOOTSTRAP_TOKEN_PATTERN.test(payload.bootstrapToken)
  ) {
    throw new Error("This QR code does not contain a valid TrailGuard pairing token.");
  }

  return {
    deviceId: payload.deviceId.toUpperCase(),
    bootstrapToken: payload.bootstrapToken,
  };
}

export function parseDeviceInformation(text) {
  let info;
  try {
    info = JSON.parse(text);
  } catch {
    throw new Error("The wearable returned invalid device information.");
  }

  if (
    info?.protocolVersion !== 1 ||
    typeof info.deviceId !== "string" ||
    !UUID_V4_PATTERN.test(info.deviceId) ||
    typeof info.publicKeyPem !== "string" ||
    !info.publicKeyPem.startsWith("-----BEGIN PUBLIC KEY-----")
  ) {
    throw new Error("The wearable uses an unsupported pairing protocol.");
  }
  return { ...info, deviceId: info.deviceId.toUpperCase() };
}

export function createPairingChallengePayload(challenge) {
  return JSON.stringify({
    challengeId: challenge.challengeId,
    deviceId: challenge.deviceId.toUpperCase(),
    userId: challenge.userId,
    nonce: challenge.nonce,
    expiresAt: challenge.expiresAt,
  });
}

export function parsePairingProof(text) {
  let proof;
  try {
    proof = JSON.parse(text);
  } catch {
    throw new Error("The wearable returned an invalid pairing proof.");
  }

  if (
    typeof proof?.nonce !== "string" ||
    typeof proof?.signature !== "string" ||
    !/^[A-Za-z0-9_-]{43}$/.test(proof.nonce) ||
    !/^[A-Za-z0-9_-]{86}$/.test(proof.signature)
  ) {
    throw new Error("The wearable returned an incomplete pairing proof.");
  }
  return proof;
}

export function parseAuthorizationChallenge(text) {
  let challenge;
  try {
    challenge = JSON.parse(text);
  } catch {
    throw new Error("The wearable returned an invalid authorization challenge.");
  }
  if (
    typeof challenge?.deviceId !== "string" ||
    !UUID_V4_PATTERN.test(challenge.deviceId) ||
    typeof challenge?.challengeId !== "string" ||
    !UUID_V4_PATTERN.test(challenge.challengeId) ||
    typeof challenge?.nonce !== "string" ||
    !BOOTSTRAP_TOKEN_PATTERN.test(challenge.nonce)
  ) {
    throw new Error("The wearable returned an incomplete authorization challenge.");
  }
  return { ...challenge, deviceId: challenge.deviceId.toUpperCase() };
}

export function serializeAuthorizationReceipt(receipt) {
  if (
    receipt?.receiptVersion !== 1 ||
    !["PAIR", "TELEMETRY"].includes(receipt.scope) ||
    typeof receipt.deviceId !== "string" ||
    !UUID_V4_PATTERN.test(receipt.deviceId.toLowerCase()) ||
    typeof receipt.userId !== "string" ||
    !/^[a-f0-9]{24}$/i.test(receipt.userId) ||
    typeof receipt.challengeId !== "string" ||
    !UUID_V4_PATTERN.test(receipt.challengeId) ||
    typeof receipt.nonce !== "string" ||
    !BOOTSTRAP_TOKEN_PATTERN.test(receipt.nonce) ||
    !Number.isSafeInteger(receipt.issuedAtUnixMs) ||
    receipt.issuedAtUnixMs <= 0 ||
    !Number.isInteger(receipt.leaseSeconds) ||
    receipt.leaseSeconds < 0 ||
    receipt.leaseSeconds > 900 ||
    (receipt.scope === "PAIR" && receipt.leaseSeconds !== 0) ||
    (receipt.scope === "TELEMETRY" && receipt.leaseSeconds === 0) ||
    typeof receipt.signature !== "string" ||
    !/^[A-Za-z0-9_-]{86}$/.test(receipt.signature)
  ) {
    throw new Error("The backend returned an invalid device authorization receipt.");
  }
  return JSON.stringify(receipt);
}

export function getBluetoothSupport(navigatorObject = globalThis.navigator) {
  if (!globalThis.isSecureContext) {
    return "Bluetooth pairing requires HTTPS or localhost.";
  }
  if (!navigatorObject?.bluetooth?.requestDevice) {
    return "Bluetooth pairing requires a Chromium-based browser with Web Bluetooth.";
  }
  return null;
}
