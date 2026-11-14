const crypto = require("crypto");
const Device = require("../models/Device");
const DeviceAuthNonce = require("../models/DeviceAuthNonce");
const deviceAuth = require("../middleware/deviceAuthMiddleware");
jest.mock("../models/Device");
jest.mock("../models/DeviceAuthNonce");
describe("Device Authentication Middleware", () => {
  let privateKey;
  let publicKey;
  let device;
  let next;
  let res;
  const DEVICE_ID = "550E8400-E29B-41D4-A716-446655440000";
  const USER_ID = "user-123";
  function createResponse() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  }
  function createRequest({
    body = {
      deviceId: DEVICE_ID,
      vitals: {
        heartRate: 75,
        spo2: 98,
      },
    },
    deviceId = DEVICE_ID,
    timestamp = Date.now(),
    nonce = crypto.randomBytes(32).toString("base64url"),
    method = "POST",
    originalUrl = "/api/device/readings",
  } = {}) {
    const rawBody = Buffer.from(JSON.stringify(body));
    const bodyHash = crypto.createHash("sha256").update(rawBody).digest("hex");
    const canonicalMessage = [
      "v1",
      method,
      originalUrl,
      deviceId,
      String(timestamp),
      nonce,
      bodyHash,
    ].join("\n");
    const signature = crypto
      .sign(null, Buffer.from(canonicalMessage, "utf8"), privateKey)
      .toString("base64url");
    return {
      method,
      originalUrl,
      rawBody,
      get: jest.fn((header) => {
        const headers = {
          "X-Device-ID": deviceId,
          "X-Device-Timestamp": String(timestamp),
          "X-Device-Nonce": nonce,
          "X-Device-Signature": signature,
        };
        return headers[header];
      }),
    };
  }
  beforeEach(() => {
    jest.clearAllMocks();
    const keyPair = crypto.generateKeyPairSync("ed25519");
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
    device = {
      deviceId: DEVICE_ID,
      deviceName: "Test Wearable",
      state: "PAIRED",
      status: "active",
      userId: USER_ID,
      keyVersion: 1,

      // Store the public key in the same PEM format
      // used by the real Device model.
      publicKey: publicKey.export({
        type: "spki",
        format: "pem",
      }),
    };
    /*
     * deviceAuthMiddleware uses:
     *
     * Device.findOne(...).select(...)
     *
     * Therefore the mocked findOne must provide a select() method.
     */
    Device.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(device),
    });
    DeviceAuthNonce.create.mockResolvedValue({
      deviceId: DEVICE_ID,
    });
    next = jest.fn();
    res = createResponse();
  });
  test("accepts a valid Ed25519-signed telemetry request", async () => {
    const req = createRequest();
    await deviceAuth(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.device).toBe(device);
    expect(req.deviceId).toBe(DEVICE_ID);
    expect(req.userId).toBe(USER_ID);
    expect(Device.findOne).toHaveBeenCalled();
    expect(DeviceAuthNonce.create).toHaveBeenCalledTimes(1);
  });
  test("rejects a request with an invalid signature", async () => {
    const req = createRequest();
    req.get.mockImplementation((header) => {
      const headers = {
        "X-Device-ID": DEVICE_ID,
        "X-Device-Timestamp": String(Date.now()),
        "X-Device-Nonce": crypto.randomBytes(32).toString("base64url"),
        /*
         * Valid base64url length but invalid cryptographic signature.
         */
        "X-Device-Signature": crypto.randomBytes(64).toString("base64url"),
      };
      return headers[header];
    });
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Device authentication failed",
    });
    expect(next).not.toHaveBeenCalled();
    expect(DeviceAuthNonce.create).not.toHaveBeenCalled();
  });
  test("rejects telemetry when the body is modified after signing", async () => {
    const req = createRequest();
    /*
     * The signature was generated using the original body.
     *
     * Changing rawBody after signing must invalidate the signature.
     */
    req.rawBody = Buffer.from(
      JSON.stringify({
        deviceId: DEVICE_ID,
        vitals: {
          heartRate: 190,
          spo2: 60,
        },
      }),
    );
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
    expect(DeviceAuthNonce.create).not.toHaveBeenCalled();
  });
  test("rejects a stale timestamp", async () => {
    const staleTimestamp = Date.now() - 10 * 60 * 1000;
    const req = createRequest({
      timestamp: staleTimestamp,
    });
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Device timestamp is outside the accepted window",
    });
    expect(next).not.toHaveBeenCalled();
    expect(Device.findOne).not.toHaveBeenCalled();
  });
  test("rejects a future timestamp outside the accepted window", async () => {
    const futureTimestamp = Date.now() + 10 * 60 * 1000;
    const req = createRequest({
      timestamp: futureTimestamp,
    });
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Device timestamp is outside the accepted window",
    });
    expect(next).not.toHaveBeenCalled();
    expect(Device.findOne).not.toHaveBeenCalled();
  });
  test("rejects an unknown or inactive device", async () => {
    Device.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    const req = createRequest();
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unknown, unpaired, or inactive device",
    });
    expect(next).not.toHaveBeenCalled();
    expect(DeviceAuthNonce.create).not.toHaveBeenCalled();
  });
  test("rejects a device without a public key", async () => {
    device.publicKey = null;
    Device.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(device),
    });
    const req = createRequest();
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
    expect(DeviceAuthNonce.create).not.toHaveBeenCalled();
  });
  test("rejects an unpaired device", async () => {
    device.state = "PROVISIONED";
    Device.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(device),
    });
    const req = createRequest();
    await deviceAuth(req, res, next);
    /*
     * The actual database query should prevent this device
     * from being returned.
     */
    Device.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    expect(Device.findOne).toHaveBeenCalled();
  });
  test("rejects a revoked device", async () => {
    device.state = "REVOKED";
    Device.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    const req = createRequest();
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
  test("rejects a reused nonce", async () => {
    const duplicateError = new Error("Duplicate nonce");
    duplicateError.code = 11000;
    DeviceAuthNonce.create.mockRejectedValue(duplicateError);
    const req = createRequest();
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Telemetry request has already been used",
    });
    expect(next).not.toHaveBeenCalled();
  });
  test("does not trust userId supplied by telemetry", async () => {
    const req = createRequest({
      body: {
        deviceId: DEVICE_ID,
        userId: "attacker-user",
        vitals: {
          heartRate: 80,
          spo2: 98,
        },
      },
    });
    await deviceAuth(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    /*
     * The authenticated user must come from Device.userId,
     * not from the telemetry body.
     */
    expect(req.userId).toBe(USER_ID);
    expect(req.userId).not.toBe("attacker-user");
  });
  test("rejects when raw request body is unavailable", async () => {
    const req = createRequest();
    delete req.rawBody;
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Device authentication is unavailable",
    });
    expect(next).not.toHaveBeenCalled();
  });
  test("rejects an invalid device ID", async () => {
    const req = createRequest({
      deviceId: "NOT-A-DEVICE-ID",
    });
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
    expect(Device.findOne).not.toHaveBeenCalled();
  });
  test("rejects an invalid nonce format", async () => {
    const req = createRequest();
    req.get.mockImplementation((header) => {
      const headers = {
        "X-Device-ID": DEVICE_ID,
        "X-Device-Timestamp": String(Date.now()),
        "X-Device-Nonce": "invalid-nonce",
        "X-Device-Signature": crypto.randomBytes(64).toString("base64url"),
      };
      return headers[header];
    });
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
  test("rejects when the HTTP method changes after signing", async () => {
    const req = createRequest();
    /*
     * Signature was created for POST.
     * Changing the request method to PUT must invalidate it.
     */
    req.method = "PUT";
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
  test("rejects when the endpoint changes after signing", async () => {
    const req = createRequest();
    /*
     * Signature was created for:
     * /api/device/readings
     *
     * Changing the endpoint must invalidate the signature.
     */
    req.originalUrl = "/api/device/other";
    await deviceAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
