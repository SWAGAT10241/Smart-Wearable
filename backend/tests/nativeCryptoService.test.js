const crypto = require("crypto");
const {
  verifyCanonicalSignature,
  unpackTelemetryPacket,
  getEngineStatus,
} = require("../services/nativeCryptoService");

describe("Native Crypto Service (Rust / Node Bridge)", () => {
  let keyPair;
  let publicKeyPem;

  beforeAll(() => {
    keyPair = crypto.generateKeyPairSync("ed25519");
    publicKeyPem = keyPair.publicKey.export({ type: "spki", format: "pem" });
  });

  test("should report engine status accurately", () => {
    const status = getEngineStatus();
    expect(status).toHaveProperty("engine");
    expect(status).toHaveProperty("nativeAvailable");
    expect(typeof status.nativeAvailable).toBe("boolean");
  });

  test("should verify valid canonical request signature", () => {
    const method = "POST";
    const path = "/api/telemetry";
    const deviceId = "TRAILGUARD-DEMO-001";
    const timestamp = Date.now().toString();
    const nonce = "test_nonce_mock_random_string_xyz_12345678901";
    const bodyHash = crypto.createHash("sha256").update(JSON.stringify({ heartRate: 75 })).digest("hex");

    const canonicalMessage = [
      "v1",
      method.toUpperCase(),
      path,
      deviceId,
      timestamp,
      nonce,
      bodyHash,
    ].join("\n");

    const signature = crypto
      .sign(null, Buffer.from(canonicalMessage, "utf8"), keyPair.privateKey)
      .toString("base64url");

    const isValid = verifyCanonicalSignature({
      publicKey: publicKeyPem,
      method,
      path,
      deviceId,
      timestamp,
      nonce,
      bodyHash,
      signature,
    });

    expect(isValid).toBe(true);
  });

  test("should reject tampered body hash in canonical signature", () => {
    const method = "POST";
    const path = "/api/telemetry";
    const deviceId = "TRAILGUARD-DEMO-001";
    const timestamp = Date.now().toString();
    const nonce = "test_nonce_mock_random_string_xyz_12345678901";
    const bodyHash = crypto.createHash("sha256").update(JSON.stringify({ heartRate: 75 })).digest("hex");

    const canonicalMessage = [
      "v1",
      method.toUpperCase(),
      path,
      deviceId,
      timestamp,
      nonce,
      bodyHash,
    ].join("\n");

    const signature = crypto
      .sign(null, Buffer.from(canonicalMessage, "utf8"), keyPair.privateKey)
      .toString("base64url");

    const isValid = verifyCanonicalSignature({
      publicKey: publicKeyPem,
      method,
      path,
      deviceId,
      timestamp,
      nonce,
      bodyHash: "0000000000000000000000000000000000000000000000000000000000000000",
      signature,
    });

    expect(isValid).toBe(false);
  });
});
