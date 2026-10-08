import { describe, expect, it } from "vitest";
import {
  createPairingChallengePayload,
  parseDeviceInformation,
  parsePairingProof,
  parsePairingQr,
} from "../src/lib/devicePairing";

const deviceId = "b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a";
const bootstrapToken = "A".repeat(43);

describe("device pairing protocol", () => {
  it("parses only a valid one-time pairing QR payload", () => {
    expect(
      parsePairingQr(
        JSON.stringify({ version: 1, deviceId, bootstrapToken }),
      ),
    ).toEqual({ deviceId: deviceId.toUpperCase(), bootstrapToken });
    expect(() => parsePairingQr("not json")).toThrow("not a valid");
    expect(() =>
      parsePairingQr(
        JSON.stringify({ version: 1, deviceId: "TG-000001", bootstrapToken }),
      ),
    ).toThrow("valid TrailGuard");
  });

  it("validates device information returned by the wearable", () => {
    expect(
      parseDeviceInformation(
        JSON.stringify({
          protocolVersion: 1,
          deviceId,
          publicKeyPem: "-----BEGIN PUBLIC KEY-----\nkey\n-----END PUBLIC KEY-----\n",
        }),
      ).deviceId,
    ).toBe(deviceId.toUpperCase());
    expect(() =>
      parseDeviceInformation(JSON.stringify({ protocolVersion: 2, deviceId })),
    ).toThrow("unsupported pairing protocol");
  });

  it("serializes the challenge in the signed canonical field order", () => {
    const payload = createPairingChallengePayload({
      challengeId: "challenge-id",
      deviceId,
      userId: "user-id",
      nonce: "nonce",
      expiresAt: "2030-01-01T00:00:00.000Z",
    });
    expect(payload).toBe(
      `{"challengeId":"challenge-id","deviceId":"${deviceId.toUpperCase()}","userId":"user-id","nonce":"nonce","expiresAt":"2030-01-01T00:00:00.000Z"}`,
    );
  });

  it("accepts only complete base64url pairing proofs", () => {
    const proof = { nonce: "N".repeat(43), signature: "S".repeat(86) };
    expect(parsePairingProof(JSON.stringify(proof))).toEqual(proof);
    expect(() =>
      parsePairingProof(JSON.stringify({ nonce: proof.nonce, signature: "bad" })),
    ).toThrow("incomplete pairing proof");
  });
});
