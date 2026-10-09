import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BLE_AUTHENTICATION_TIMEOUT_MS,
  BLE_CONNECT_TIMEOUT_MS,
  BLE_STALE_TIMEOUT_MS,
  BleAuthorizationError,
  getBleReconnectDelay,
  isBleAuthorizationFailure,
  withBleTimeout,
} from "../src/lib/bleConnection";

afterEach(() => {
  vi.useRealTimers();
});

describe("BLE connection policy", () => {
  it("defines bounded connect, authentication, and stale-stream deadlines", () => {
    expect(BLE_CONNECT_TIMEOUT_MS).toBe(15_000);
    expect(BLE_AUTHENTICATION_TIMEOUT_MS).toBe(10_000);
    expect(BLE_STALE_TIMEOUT_MS).toBe(60_000);
  });

  it("applies capped exponential backoff without stopping retries", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 20].map(getBleReconnectDelay)).toEqual([
      1000, 2000, 4000, 8000, 16_000, 30_000, 30_000, 30_000,
    ]);
    expect(() => getBleReconnectDelay(-1)).toThrow(
      "non-negative integer",
    );
  });

  it("rejects a BLE operation after its configured deadline", async () => {
    vi.useFakeTimers();
    const neverCompletes = new Promise(() => {});
    const result = withBleTimeout(
      neverCompletes,
      BLE_CONNECT_TIMEOUT_MS,
      "BLE connection",
    );

    const assertion = expect(result).rejects.toThrow(
      "BLE connection timed out after 15000 ms.",
    );
    await vi.advanceTimersByTimeAsync(BLE_CONNECT_TIMEOUT_MS);
    await assertion;
  });

  it("distinguishes authorization rejection from retryable failures", () => {
    expect(isBleAuthorizationFailure({ status: 401 })).toBe(true);
    expect(isBleAuthorizationFailure({ status: 403 })).toBe(true);
    expect(isBleAuthorizationFailure({ status: 404 })).toBe(true);
    expect(isBleAuthorizationFailure({ status: 503 })).toBe(false);
    expect(isBleAuthorizationFailure(new Error("offline"))).toBe(false);
    expect(isBleAuthorizationFailure(new BleAuthorizationError("rejected"))).toBe(
      true,
    );
  });
});
