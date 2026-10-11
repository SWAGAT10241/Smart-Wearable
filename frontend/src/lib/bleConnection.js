export const BLE_CONNECT_TIMEOUT_MS = 15_000;
export const BLE_AUTHENTICATION_TIMEOUT_MS = 10_000;
export const BLE_STALE_TIMEOUT_MS = 60_000;

const RECONNECT_DELAYS_MS = [1000, 2000, 4000, 8000, 16_000, 30_000];

export class BleAuthorizationError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "BleAuthorizationError";
  }
}

export function getBleReconnectDelay(attempt) {
  if (!Number.isInteger(attempt) || attempt < 0) {
    throw new TypeError("Reconnect attempt must be a non-negative integer.");
  }
  return RECONNECT_DELAYS_MS[Math.min(attempt, RECONNECT_DELAYS_MS.length - 1)];
}

export function withBleTimeout(promise, timeoutMs, operation) {
  if (!promise || typeof promise.then !== "function") {
    throw new TypeError("A promise is required for a BLE timeout.");
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new TypeError("BLE timeout must be a positive finite duration.");
  }

  let timer;
  const timeout = new Promise((_, reject) => {
    timer = globalThis.setTimeout(
      () => reject(new Error(`${operation} timed out after ${timeoutMs} ms.`)),
      timeoutMs,
    );
  });

  return Promise.race([promise, timeout]).finally(() => {
    globalThis.clearTimeout(timer);
  });
}

export function isBleAuthorizationFailure(error) {
  return (
    error instanceof BleAuthorizationError ||
    [401, 403, 404].includes(error?.status)
  );
}
