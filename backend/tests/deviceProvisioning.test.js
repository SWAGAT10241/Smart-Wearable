const crypto = require("crypto");
const fs = require("fs");
const QRCode = require("qrcode");

const mockDeviceCreate = jest.fn();
const mockDeviceFindOneAndUpdate = jest.fn();
jest.mock("../models/Device", () => ({
  create: mockDeviceCreate,
  findOneAndUpdate: mockDeviceFindOneAndUpdate,
}));

const {
  provisionDevice,
  validateDeviceId,
  validatePublicKey,
} = require("../services/deviceProvisioningService");
const {
  createPairingQrPayload,
  parseArguments,
} = require("../scripts/provision-device");
const {
  generateAuthorityKeys,
  parseArguments: parseAuthorityArguments,
} = require("../scripts/generate-device-authority-keys");

describe("device provisioning", () => {
  const deviceId = "b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a";
  let publicKeyPem;

  beforeEach(() => {
    mockDeviceCreate.mockReset();
    mockDeviceFindOneAndUpdate.mockReset().mockResolvedValue(null);
    const { publicKey } = crypto.generateKeyPairSync("ed25519");
    publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
    mockDeviceCreate.mockResolvedValue({ deviceId });
  });

  test("creates a unique provisioned device and returns the one-time token once", async () => {
    const now = Date.now();
    const result = await provisionDevice({ deviceId, publicKeyPem });

    expect(mockDeviceCreate).toHaveBeenCalledTimes(1);
    const record = mockDeviceCreate.mock.calls[0][0];
    expect(record).toEqual(
      expect.objectContaining({
        deviceId: deviceId.toUpperCase(),
        deviceName: "TrailGuard Wearable",
        publicKey: publicKeyPem,
        keyVersion: 1,
        state: "PROVISIONED",
        userId: null,
        status: "inactive",
      }),
    );
    expect(record.bootstrapTokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(record).not.toHaveProperty("bootstrapToken");
    expect(result.deviceId).toBe(deviceId.toUpperCase());
    expect(Buffer.from(result.bootstrapToken, "base64url")).toHaveLength(32);
    expect(record.bootstrapTokenHash).toBe(
      crypto.createHash("sha256").update(result.bootstrapToken).digest("hex"),
    );
    expect(Date.parse(result.expiresAt)).toBeGreaterThanOrEqual(
      now + 30 * 24 * 60 * 60 * 1000,
    );
    expect(Date.parse(result.expiresAt)).toBeLessThanOrEqual(
      now + 30 * 24 * 60 * 60 * 1000 + 1000,
    );
  });

  test("requires a UUIDv4 device identity", () => {
    expect(() => validateDeviceId("TG-000001")).toThrow("valid UUIDv4");
    expect(() =>
      validateDeviceId("b3fdc7e3-995b-4f32-1d37-c8aaf9bb9f2a"),
    ).toThrow("valid UUIDv4");
  });

  test("accepts only Ed25519 SPKI public keys", () => {
    expect(validatePublicKey(publicKeyPem)).toContain("BEGIN PUBLIC KEY");
    const { publicKey: rsaPublicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    expect(() =>
      validatePublicKey(
        rsaPublicKey.export({ type: "spki", format: "pem" }).toString(),
      ),
    ).toThrow("must be Ed25519");
    expect(() => validatePublicKey("not a key")).toThrow("SPKI PEM public key");
  });

  test("does not replace an existing device record", async () => {
    const duplicate = new Error("duplicate key");
    duplicate.code = 11000;
    mockDeviceCreate.mockRejectedValue(duplicate);

    await expect(provisionDevice({ deviceId, publicKeyPem })).rejects.toBe(
      duplicate,
    );
    expect(mockDeviceFindOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: deviceId.toUpperCase(),
        publicKey: publicKeyPem,
        state: "PROVISIONED",
        userId: null,
        $or: expect.any(Array),
      }),
      expect.objectContaining({
        $set: expect.objectContaining({
          bootstrapTokenHash: expect.any(String),
          bootstrapTokenExpiresAt: expect.any(Date),
        }),
      }),
      { new: true, runValidators: true },
    );
    expect(mockDeviceCreate).toHaveBeenCalledTimes(1);
  });

  test("reissues a token only for an unpaired record with the same hardware key", async () => {
    mockDeviceFindOneAndUpdate.mockResolvedValue({ deviceId });

    const result = await provisionDevice({ deviceId, publicKeyPem });

    expect(mockDeviceCreate).not.toHaveBeenCalled();
    const [filter, update] = mockDeviceFindOneAndUpdate.mock.calls[0];
    expect(filter.publicKey).toBe(publicKeyPem);
    expect(filter.state).toBe("PROVISIONED");
    expect(filter.userId).toBeNull();
    expect(update.$set.bootstrapTokenHash).toBe(
      crypto.createHash("sha256").update(result.bootstrapToken).digest("hex"),
    );
  });

  test("prepares a QR before saving and removes it if persistence fails", async () => {
    const cleanup = jest.fn();
    const duplicate = new Error("duplicate key");
    mockDeviceCreate.mockRejectedValue(duplicate);
    const prepareBootstrapToken = jest.fn().mockResolvedValue(cleanup);

    await expect(
      provisionDevice({ deviceId, publicKeyPem, prepareBootstrapToken }),
    ).rejects.toBe(duplicate);

    expect(prepareBootstrapToken).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: deviceId.toUpperCase(),
        bootstrapToken: expect.stringMatching(/^[A-Za-z0-9_-]{43}$/),
        expiresAt: expect.any(String),
      }),
    );
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  test("parses provisioning arguments without accepting secret CLI arguments", () => {
    expect(
      parseArguments([
        "--",
        "--device-id",
        deviceId,
        "--public-key-file",
        "device-public.pem",
        "--device-name",
        "TrailGuard One",
        "--qr-output",
        "private/device.svg",
      ]),
    ).toEqual({
      deviceId,
      publicKeyFile: "device-public.pem",
      deviceName: "TrailGuard One",
      qrOutput: "private/device.svg",
    });
    expect(() => parseArguments(["--bootstrap-token", "secret"])).toThrow(
      "Unknown argument",
    );
    expect(() => parseArguments(["--device-id", deviceId])).toThrow(
      "public-key-file",
    );
  });

  test("encodes a versioned QR payload accepted by the dashboard scanner", () => {
    const payload = JSON.parse(
      createPairingQrPayload(deviceId.toUpperCase(), "A".repeat(43)),
    );
    expect(payload).toEqual({
      version: 1,
      deviceId: deviceId.toUpperCase(),
      bootstrapToken: "A".repeat(43),
    });
  });

  test("renders the versioned pairing payload as an SVG QR code", async () => {
    const svg = await QRCode.toString(
      createPairingQrPayload(deviceId.toUpperCase(), "A".repeat(43)),
      { type: "svg", errorCorrectionLevel: "H", margin: 4 },
    );
    expect(svg).toMatch(/^<svg\b/);
    expect(svg).toContain("<path");
  });

  test("generates authority keys without overwriting existing output", () => {
    const os = require("os");
    const path = require("path");
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "trailguard-authority-"));
    try {
      const privateKeyFile = path.join(tempDir, "authority-private.pem");
      const publicKeyFile = path.join(tempDir, "authority-public.txt");
      const options = parseAuthorityArguments([
        "--private-key-file",
        privateKeyFile,
        "--public-key-file",
        publicKeyFile,
      ]);
      const result = generateAuthorityKeys(options);
      const privateKey = crypto.createPrivateKey(
        fs.readFileSync(privateKeyFile, "utf8"),
      );
      expect(privateKey.asymmetricKeyType).toBe("ed25519");
      expect(result.publicKeyBase64url).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(fs.readFileSync(publicKeyFile, "utf8").trim()).toBe(
        result.publicKeyBase64url,
      );
      expect(() => generateAuthorityKeys(options)).toThrow();
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
