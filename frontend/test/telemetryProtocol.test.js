import { describe, expect, it } from "vitest";
import {
  parseTelemetryFrame,
  TelemetryProtocolError,
  TelemetrySequenceTracker,
} from "../src/lib/telemetryProtocol";

const deviceId = "b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a";
const bootId = "6e8f6f5d-747a-4f01-8ec5-2be9b8a3d5ae";
const nowMs = Date.parse("2026-10-08T06:20:00.000Z");

function makeFrame(overrides = {}) {
  return {
    schemaVersion: 1,
    messageType: "telemetry",
    deviceId,
    bootId,
    sequence: 10,
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
    ...overrides,
  };
}

function parse(frame = makeFrame()) {
  return parseTelemetryFrame(JSON.stringify(frame), { nowMs });
}

function expectProtocolError(frame, code, options) {
  try {
    const input =
      typeof frame === "string" || frame instanceof Uint8Array
        ? frame
        : JSON.stringify(frame);
    parseTelemetryFrame(input, {
      nowMs,
      ...options,
    });
    throw new Error(`Expected telemetry error: ${code}`);
  } catch (error) {
    expect(error).toBeInstanceOf(TelemetryProtocolError);
    expect(error.code).toBe(code);
  }
}

describe("telemetry protocol v1", () => {
  it("accepts a valid frame and retains its typed readings", () => {
    expect(parse()).toMatchObject({
      schemaVersion: 1,
      messageType: "telemetry",
      deviceId,
      bootId,
      sequence: 10,
      payload: { heartRateBpm: 78, temperatureC: 36.7 },
    });
  });

  it("rejects oversized and malformed frames", () => {
    expectProtocolError(" ".repeat(513), "frame_too_large");
    expectProtocolError(new Uint8Array([0xc3]), "invalid_utf8");
    expectProtocolError("{", "malformed_json");
    expectProtocolError({ ...makeFrame(), extra: true }, "invalid_envelope_shape");
    expectProtocolError(
      { ...makeFrame(), schemaVersion: 2 },
      "unsupported_protocol",
    );
  });

  it("validates identities, counter bounds, and exact timestamp format", () => {
    expectProtocolError({ ...makeFrame(), bootId: "not-a-uuid" }, "invalid_identity");
    expectProtocolError({ ...makeFrame(), sequence: -1 }, "invalid_sequence");
    expectProtocolError(
      { ...makeFrame(), timestamp: "2026-10-08T06:20:00Z" },
      "invalid_timestamp",
    );
    expectProtocolError(
      { ...makeFrame(), timestamp: "2026-10-08T06:20:00.000Z" },
      "timestamp_out_of_window",
      { nowMs: nowMs + 5 * 60 * 1000 + 1 },
    );
  });

  it("rejects out-of-range values and inconsistent sensor status", () => {
    expectProtocolError(
      {
        ...makeFrame(),
        payload: { ...makeFrame().payload, spo2Percent: 101 },
      },
      "invalid_reading",
    );
    expectProtocolError(
      {
        ...makeFrame(),
        payload: {
          ...makeFrame().payload,
          heartRateBpm: null,
          sensorHealth: {
            ...makeFrame().payload.sensorHealth,
            heartRate: "ok",
          },
        },
      },
      "invalid_sensor_health",
    );
    expectProtocolError(
      {
        ...makeFrame(),
        payload: { ...makeFrame().payload, unknownSensor: 1 },
      },
      "invalid_payload_shape",
    );
  });

  it("delivers in-order frames and rejects already-delivered duplicates", () => {
    const tracker = new TelemetrySequenceTracker();
    const first = parse(makeFrame({ sequence: 1 }));
    const next = parse(makeFrame({ sequence: 2 }));

    expect(tracker.push(first, 0)).toMatchObject({
      status: "delivered",
      delivered: [first],
    });
    expect(tracker.push(next, 1)).toMatchObject({
      status: "delivered",
      delivered: [next],
    });
    expect(tracker.push(first, 2)).toMatchObject({
      status: "duplicate",
      delivered: [],
    });
  });

  it("buffers bounded sequence gaps and releases them in order", () => {
    const tracker = new TelemetrySequenceTracker();
    const first = parse(makeFrame({ sequence: 40 }));
    const third = parse(makeFrame({ sequence: 42 }));
    const second = parse(makeFrame({ sequence: 41 }));
    tracker.push(first, 0);

    expect(tracker.push(third, 1)).toMatchObject({ status: "buffered" });
    expect(tracker.push(third, 2)).toMatchObject({ status: "duplicate" });
    expect(tracker.push(second, 3)).toMatchObject({
      status: "delivered",
      delivered: [second, third],
    });
    expect(
      tracker.push(parse(makeFrame({ sequence: 80 })), 4).status,
    ).toBe("gap_too_large");
  });

  it("expires unresolved gaps after ten seconds and starts a fresh baseline", () => {
    const tracker = new TelemetrySequenceTracker();
    tracker.push(parse(makeFrame({ sequence: 1 })), 0);
    const delayed = parse(makeFrame({ sequence: 3 }));
    expect(tracker.push(delayed, 1).status).toBe("buffered");

    expect(tracker.flushExpired(10_001)).toEqual([
      { code: "sequence_gap_timeout", discardedCount: 1 },
    ]);
    expect(tracker.push(delayed, 10_002).status).toBe("duplicate");
    const newBaseline = parse(makeFrame({ sequence: 8 }));
    expect(tracker.push(newBaseline, 10_003)).toMatchObject({
      status: "delivered",
      delivered: [newBaseline],
      expired: [],
    });
  });
});
