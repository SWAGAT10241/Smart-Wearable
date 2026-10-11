import {
  parseTelemetryFrame,
  TelemetryProtocolError,
  TelemetrySequenceTracker,
} from "./telemetryProtocol";

const TELEMETRY_CHARACTERISTIC_UUID =
  "6f2a0002-7b1c-4d90-a5e2-8c1d3f6a0001";
const EXPIRY_POLL_INTERVAL_MS = 1000;

function publishDiagnostic(callback, diagnostic) {
  try {
    callback?.(diagnostic);
  } catch (error) {
    console.error("[BLE telemetry] Diagnostic callback failed:", error);
  }
}

export async function subscribeToTelemetry(
  characteristic,
  {
    deviceId,
    assertAuthenticatedConnection,
    onTelemetry,
    onDiagnostic,
    wallClock = () => Date.now(),
    monotonicClock = () => globalThis.performance?.now?.() ?? Date.now(),
  },
) {
  if (
    !characteristic ||
    characteristic.uuid?.toLowerCase() !== TELEMETRY_CHARACTERISTIC_UUID
  ) {
    throw new TypeError("A TrailGuard telemetry characteristic is required.");
  }
  if (typeof onTelemetry !== "function") {
    throw new TypeError("An onTelemetry callback is required.");
  }
  if (typeof assertAuthenticatedConnection !== "function") {
    throw new TypeError(
      "An authenticated paired BLE connection is required for telemetry.",
    );
  }
  if (typeof deviceId !== "string" || !deviceId.trim()) {
    throw new TypeError("A selected device ID is required.");
  }

  const authenticated = await assertAuthenticatedConnection();
  if (authenticated !== true) {
    throw new Error("The BLE connection is not authenticated for telemetry.");
  }

  const expectedDeviceId = deviceId.trim().toUpperCase();
  const tracker = new TelemetrySequenceTracker();
  let active = true;

  const handleNotification = (event) => {
    if (!active) return;
    const value = event.target?.value;
    if (!(value instanceof DataView)) {
      publishDiagnostic(onDiagnostic, { code: "invalid_notification_value" });
      return;
    }

    const receivedAt = monotonicClock();
    for (const diagnostic of tracker.flushExpired(receivedAt)) {
      publishDiagnostic(onDiagnostic, diagnostic);
    }

    const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    let frame;
    try {
      frame = parseTelemetryFrame(bytes, { nowMs: wallClock() });
    } catch (error) {
      publishDiagnostic(onDiagnostic, {
        code:
          error instanceof TelemetryProtocolError
            ? error.code
            : "invalid_frame",
      });
      return;
    }

    if (frame.deviceId.toUpperCase() !== expectedDeviceId) {
      publishDiagnostic(onDiagnostic, { code: "device_mismatch" });
      return;
    }

    const result = tracker.push(frame, receivedAt);
    if (result.status === "gap_too_large") {
      publishDiagnostic(onDiagnostic, { code: "sequence_gap_too_large" });
      return;
    }
    for (const orderedFrame of result.delivered) {
      try {
        onTelemetry(orderedFrame);
      } catch (error) {
        console.error("[BLE telemetry] Consumer callback failed:", error);
      }
    }
  };

  characteristic.addEventListener("characteristicvaluechanged", handleNotification);
  const expiryTimer = globalThis.setInterval(() => {
    if (!active) return;
    for (const diagnostic of tracker.flushExpired(monotonicClock())) {
      publishDiagnostic(onDiagnostic, diagnostic);
    }
  }, EXPIRY_POLL_INTERVAL_MS);

  try {
    await characteristic.startNotifications();
  } catch (error) {
    active = false;
    globalThis.clearInterval(expiryTimer);
    characteristic.removeEventListener(
      "characteristicvaluechanged",
      handleNotification,
    );
    throw error;
  }

  return async () => {
    if (!active) return;
    active = false;
    globalThis.clearInterval(expiryTimer);
    characteristic.removeEventListener(
      "characteristicvaluechanged",
      handleNotification,
    );
    if (characteristic.service?.device?.gatt?.connected) {
      await characteristic.stopNotifications();
    }
  };
}
