import { afterEach, describe, expect, it, vi } from "vitest";
import { subscribeToTelemetry } from "../src/lib/telemetryBleClient";

const deviceId = "b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a";
const bootId = "6e8f6f5d-747a-4f01-8ec5-2be9b8a3d5ae";
const nowMs = Date.parse("2026-10-08T06:20:00.000Z");
const telemetryUuid = "6f2a0002-7b1c-4d90-a5e2-8c1d3f6a0001";

function makeFrame(sequence, id = deviceId) {
  return {
    schemaVersion: 1,
    messageType: "telemetry",
    deviceId: id,
    bootId,
    sequence,
    timestamp: new Date(nowMs).toISOString(),
    payload: {
      heartRateBpm: 78,
      spo2Percent: 98,
      temperatureC: 36.7,
      batteryPercent: 72,
      charging: false,
      sensorHealth: {
        heartRate: "ok",
        spo2: "ok",
        temperature: "ok",
      },
      riskEngineStatus: "normal",
    },
  };
}

function makeCharacteristic() {
  const listeners = new Map();
  return {
    uuid: telemetryUuid,
    service: { device: { gatt: { connected: true } } },
    addEventListener: vi.fn((name, listener) => listeners.set(name, listener)),
    removeEventListener: vi.fn((name) => listeners.delete(name)),
    startNotifications: vi.fn().mockResolvedValue(undefined),
    stopNotifications: vi.fn().mockResolvedValue(undefined),
    emit(frame) {
      const bytes = new TextEncoder().encode(JSON.stringify(frame));
      const buffer = new Uint8Array(bytes.length + 4);
      buffer.set(bytes, 2);
      const value = new DataView(buffer.buffer, 2, bytes.length);
      listeners.get("characteristicvaluechanged")?.({ target: { value } });
    },
    emitBytes(bytes) {
      const value = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      listeners.get("characteristicvaluechanged")?.({ target: { value } });
    },
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("BLE telemetry notification client", () => {
  it("subscribes, delivers validated selected-device frames, and cleans up", async () => {
    const characteristic = makeCharacteristic();
    const onTelemetry = vi.fn();
    const onDiagnostic = vi.fn();
    const stop = await subscribeToTelemetry(characteristic, {
      deviceId: deviceId.toUpperCase(),
      assertAuthenticatedConnection: vi.fn().mockResolvedValue(true),
      onTelemetry,
      onDiagnostic,
      wallClock: () => nowMs,
      monotonicClock: () => 100,
    });

    expect(characteristic.startNotifications).toHaveBeenCalledOnce();
    characteristic.emit(makeFrame(1));
    expect(onTelemetry).toHaveBeenCalledWith(
      expect.objectContaining({ sequence: 1, deviceId }),
    );

    await stop();
    await stop();
    expect(characteristic.stopNotifications).toHaveBeenCalledOnce();
    expect(characteristic.removeEventListener).toHaveBeenCalledOnce();
  });

  it("diagnoses invalid and foreign-device frames without exposing payloads", async () => {
    const characteristic = makeCharacteristic();
    const onTelemetry = vi.fn();
    const onDiagnostic = vi.fn();
    await subscribeToTelemetry(characteristic, {
      deviceId,
      assertAuthenticatedConnection: vi.fn().mockResolvedValue(true),
      onTelemetry,
      onDiagnostic,
      wallClock: () => nowMs,
    });

    characteristic.emit(makeFrame(1, "a4fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a"));
    characteristic.emitBytes(new Uint8Array([0xff, 0xfe]));

    expect(onTelemetry).not.toHaveBeenCalled();
    expect(onDiagnostic.mock.calls.map(([diagnostic]) => diagnostic.code)).toEqual([
      "device_mismatch",
      "invalid_utf8",
    ]);
    expect(JSON.stringify(onDiagnostic.mock.calls)).not.toContain("heartRateBpm");
  });

  it("preserves sequence order and emits a bounded gap timeout diagnostic", async () => {
    vi.useFakeTimers();
    let monotonicNow = 0;
    const characteristic = makeCharacteristic();
    const onTelemetry = vi.fn();
    const onDiagnostic = vi.fn();
    const stop = await subscribeToTelemetry(characteristic, {
      deviceId,
      assertAuthenticatedConnection: vi.fn().mockResolvedValue(true),
      onTelemetry,
      onDiagnostic,
      wallClock: () => nowMs,
      monotonicClock: () => monotonicNow,
    });

    characteristic.emit(makeFrame(10));
    characteristic.emit(makeFrame(12));
    expect(onTelemetry.mock.calls.map(([frame]) => frame.sequence)).toEqual([10]);
    characteristic.emit(makeFrame(11));
    expect(onTelemetry.mock.calls.map(([frame]) => frame.sequence)).toEqual([
      10, 11, 12,
    ]);

    characteristic.emit(makeFrame(14));
    monotonicNow = 10_000;
    vi.advanceTimersByTime(1000);
    expect(onDiagnostic).toHaveBeenCalledWith({
      code: "sequence_gap_timeout",
      discardedCount: 1,
    });

    await stop();
  });

  it("removes its listener and timer when subscription fails", async () => {
    const characteristic = makeCharacteristic();
    const failure = new Error("notifications unavailable");
    characteristic.startNotifications.mockRejectedValue(failure);

    await expect(
      subscribeToTelemetry(characteristic, {
        deviceId,
        assertAuthenticatedConnection: vi.fn().mockResolvedValue(true),
        onTelemetry: vi.fn(),
      }),
    ).rejects.toBe(failure);
    expect(characteristic.removeEventListener).toHaveBeenCalledOnce();
  });

  it("fails closed without an authenticated paired-link assertion", async () => {
    const characteristic = makeCharacteristic();
    await expect(
      subscribeToTelemetry(characteristic, {
        deviceId,
        onTelemetry: vi.fn(),
      }),
    ).rejects.toThrow("authenticated paired BLE connection");
    await expect(
      subscribeToTelemetry(characteristic, {
        deviceId,
        assertAuthenticatedConnection: vi.fn().mockResolvedValue(false),
        onTelemetry: vi.fn(),
      }),
    ).rejects.toThrow("not authenticated");
    expect(characteristic.startNotifications).not.toHaveBeenCalled();
  });
});
