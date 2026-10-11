export const TELEMETRY_MAX_BYTES = 512;
export const TELEMETRY_TIMESTAMP_SKEW_MS = 5 * 60 * 1000;
export const TELEMETRY_REORDER_WINDOW_MS = 10 * 1000;
export const TELEMETRY_MAX_SEQUENCE_GAP = 32;
export const TELEMETRY_MAX_BUFFERED_FRAMES = 32;

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const ENVELOPE_KEYS = [
  "schemaVersion",
  "messageType",
  "deviceId",
  "bootId",
  "sequence",
  "timestamp",
  "payload",
];
const PAYLOAD_KEYS = [
  "heartRateBpm",
  "spo2Percent",
  "temperatureC",
  "batteryPercent",
  "charging",
  "sensorHealth",
  "riskEngineStatus",
];
const SENSOR_HEALTH_KEYS = ["heartRate", "spo2", "temperature"];
const SENSOR_STATES = new Set(["ok", "unavailable", "fault", "not_integrated"]);
const RISK_STATES = new Set([
  "normal",
  "elevated",
  "critical",
  "not_integrated",
]);

export class TelemetryProtocolError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "TelemetryProtocolError";
    this.code = code;
  }
}

function reject(code, message) {
  throw new TelemetryProtocolError(code, message);
}

function hasExactKeys(value, expectedKeys) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }
  const actualKeys = Object.keys(value);
  return (
    actualKeys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.hasOwn(value, key))
  );
}

function validateTimestamp(timestamp, nowMs, maxTimestampSkewMs) {
  if (
    typeof timestamp !== "string" ||
    !TIMESTAMP_PATTERN.test(timestamp) ||
    Number.isNaN(Date.parse(timestamp)) ||
    new Date(timestamp).toISOString() !== timestamp
  ) {
    reject("invalid_timestamp", "Telemetry timestamp must be UTC RFC 3339 with milliseconds.");
  }
  if (Math.abs(nowMs - Date.parse(timestamp)) > maxTimestampSkewMs) {
    reject("timestamp_out_of_window", "Telemetry timestamp is outside the accepted clock window.");
  }
}

function validateNullableInteger(value, minimum, maximum, fieldName) {
  if (
    value !== null &&
    (!Number.isInteger(value) || value < minimum || value > maximum)
  ) {
    reject("invalid_reading", `${fieldName} is outside its allowed range.`);
  }
}

function validatePayload(payload) {
  if (!hasExactKeys(payload, PAYLOAD_KEYS)) {
    reject("invalid_payload_shape", "Telemetry payload has missing or unknown fields.");
  }
  validateNullableInteger(payload.heartRateBpm, 20, 240, "heartRateBpm");
  validateNullableInteger(payload.spo2Percent, 50, 100, "spo2Percent");
  validateNullableInteger(payload.batteryPercent, 0, 100, "batteryPercent");
  if (
    payload.temperatureC !== null &&
    (typeof payload.temperatureC !== "number" ||
      !Number.isFinite(payload.temperatureC) ||
      payload.temperatureC < 20 ||
      payload.temperatureC > 50)
  ) {
    reject("invalid_reading", "temperatureC is outside its allowed range.");
  }
  if (payload.charging !== null && typeof payload.charging !== "boolean") {
    reject("invalid_reading", "charging must be a boolean or null.");
  }
  if (!hasExactKeys(payload.sensorHealth, SENSOR_HEALTH_KEYS)) {
    reject("invalid_sensor_health", "sensorHealth must define every version 1 sensor.");
  }

  const readings = {
    heartRate: payload.heartRateBpm,
    spo2: payload.spo2Percent,
    temperature: payload.temperatureC,
  };
  for (const [sensor, reading] of Object.entries(readings)) {
    const health = payload.sensorHealth[sensor];
    if (!SENSOR_STATES.has(health) || (reading !== null) !== (health === "ok")) {
      reject("invalid_sensor_health", `${sensor} health must agree with its reading.`);
    }
  }

  if (!RISK_STATES.has(payload.riskEngineStatus)) {
    reject("invalid_risk_state", "riskEngineStatus is not supported.");
  }
}

export function parseTelemetryFrame(
  input,
  {
    nowMs = Date.now(),
    maxTimestampSkewMs = TELEMETRY_TIMESTAMP_SKEW_MS,
  } = {},
) {
  if (typeof input !== "string" && !(input instanceof Uint8Array)) {
    reject("invalid_frame", "Telemetry frame must be UTF-8 text or bytes.");
  }
  const bytes =
    typeof input === "string" ? new TextEncoder().encode(input) : input;
  if (bytes.byteLength > TELEMETRY_MAX_BYTES) {
    reject("frame_too_large", "Telemetry frame exceeds the 512-byte limit.");
  }

  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    reject("invalid_utf8", "Telemetry frame must contain valid UTF-8.");
  }
  if (typeof input === "string" && text !== input) {
    reject("invalid_utf8", "Telemetry frame must contain valid UTF-8.");
  }

  let frame;
  try {
    frame = JSON.parse(text);
  } catch {
    reject("malformed_json", "Telemetry frame is not valid JSON.");
  }
  if (!hasExactKeys(frame, ENVELOPE_KEYS)) {
    reject("invalid_envelope_shape", "Telemetry envelope has missing or unknown fields.");
  }
  if (frame.schemaVersion !== 1 || frame.messageType !== "telemetry") {
    reject("unsupported_protocol", "Telemetry frame version or message type is unsupported.");
  }
  if (
    typeof frame.deviceId !== "string" ||
    !UUID_V4_PATTERN.test(frame.deviceId) ||
    typeof frame.bootId !== "string" ||
    !UUID_V4_PATTERN.test(frame.bootId)
  ) {
    reject("invalid_identity", "deviceId and bootId must be lowercase UUIDv4 values.");
  }
  if (
    !Number.isInteger(frame.sequence) ||
    frame.sequence < 0 ||
    frame.sequence > 0xffffffff
  ) {
    reject("invalid_sequence", "sequence must be an unsigned 32-bit integer.");
  }
  validateTimestamp(frame.timestamp, nowMs, maxTimestampSkewMs);
  validatePayload(frame.payload);
  return frame;
}

export class TelemetrySequenceTracker {
  #streams = new Map();

  push(
    frame,
    receivedAtMs = globalThis.performance?.now?.() ?? Date.now(),
  ) {
    const key = `${frame.deviceId}:${frame.bootId}`;
    let stream = this.#streams.get(key);
    if (!stream) {
      stream = {
        nextSequence: null,
        highWaterSequence: null,
        pending: new Map(),
      };
      this.#streams.set(key, stream);
    }

    const expired = this.#expireStream(stream, receivedAtMs);
    if (stream.nextSequence === null) {
      if (
        stream.highWaterSequence !== null &&
        frame.sequence <= stream.highWaterSequence
      ) {
        return { delivered: [], status: "duplicate", expired };
      }
      stream.nextSequence = frame.sequence + 1;
      stream.highWaterSequence = frame.sequence;
      return { delivered: [frame], status: "delivered", expired };
    }

    if (frame.sequence < stream.nextSequence || stream.pending.has(frame.sequence)) {
      return { delivered: [], status: "duplicate", expired };
    }

    if (frame.sequence > stream.nextSequence) {
      const gap = frame.sequence - stream.nextSequence;
      if (
        gap > TELEMETRY_MAX_SEQUENCE_GAP ||
        stream.pending.size >= TELEMETRY_MAX_BUFFERED_FRAMES
      ) {
        return { delivered: [], status: "gap_too_large", expired };
      }
      stream.pending.set(frame.sequence, { frame, receivedAtMs });
      stream.highWaterSequence = Math.max(
        stream.highWaterSequence ?? frame.sequence,
        frame.sequence,
      );
      return { delivered: [], status: "buffered", expired };
    }

    const delivered = [frame];
    stream.highWaterSequence = Math.max(stream.highWaterSequence, frame.sequence);
    stream.nextSequence += 1;
    while (stream.pending.has(stream.nextSequence)) {
      const pending = stream.pending.get(stream.nextSequence);
      stream.pending.delete(stream.nextSequence);
      delivered.push(pending.frame);
      stream.highWaterSequence = Math.max(
        stream.highWaterSequence,
        pending.frame.sequence,
      );
      stream.nextSequence += 1;
    }
    return { delivered, status: "delivered", expired };
  }

  flushExpired(nowMs = globalThis.performance?.now?.() ?? Date.now()) {
    const diagnostics = [];
    for (const stream of this.#streams.values()) {
      const expired = this.#expireStream(stream, nowMs);
      if (expired.length > 0) {
        diagnostics.push({
          code: "sequence_gap_timeout",
          discardedCount: expired.length,
        });
      }
    }
    return diagnostics;
  }

  reset(deviceId, bootId) {
    this.#streams.delete(`${deviceId}:${bootId}`);
  }

  #expireStream(stream, nowMs) {
    const expired = [];
    for (const [sequence, pending] of stream.pending) {
      if (nowMs - pending.receivedAtMs >= TELEMETRY_REORDER_WINDOW_MS) {
        expired.push(sequence);
        stream.pending.delete(sequence);
      }
    }
    if (expired.length > 0) {
      stream.nextSequence = null;
      stream.pending.clear();
    }
    return expired;
  }
}
