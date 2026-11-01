import { useEffect, useRef, useState } from "react";
import {
  COMMAND_CHARACTERISTIC_UUID,
  AUTHORIZATION_CHARACTERISTIC_UUID,
  DEVICE_STATUS_CHARACTERISTIC_UUID,
  DEVICE_INFORMATION_CHARACTERISTIC_UUID,
  DEVICE_PAIRING_SERVICE_UUID,
  createPairingChallengePayload,
  getBluetoothSupport,
  parseDeviceInformation,
  parseDeviceStatus,
  parsePairingProof,
  parsePairingQr,
  parseAuthorizationChallenge,
  serializeAuthorizationReceipt,
} from "../lib/devicePairing";
import { devicePairingApi } from "../lib/apiClient";
import { subscribeToTelemetry } from "../lib/telemetryBleClient";
import {
  BLE_AUTHENTICATION_TIMEOUT_MS,
  BLE_CONNECT_TIMEOUT_MS,
  BleAuthorizationError,
  isBleAuthorizationFailure,
  withBleTimeout,
} from "../lib/bleConnection";

export default function PairDevicePanel({
  onPaired,
  onTelemetry,
  onTelemetrySession,
  onConnectionState,
}) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cameraOpen) return undefined;

    let active = true;
    let reader;
    const startScanner = async () => {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        if (!active) return;
        reader = new BrowserQRCodeReader();
        scannerRef.current = reader;
        await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
          if (!active || !result) return;
          try {
            const parsed = parsePairingQr(result.getText());
            setQrData(parsed);
            setError("");
            setMessage(`QR code read for device ${parsed.deviceId}.`);
            setCameraOpen(false);
          } catch (scanError) {
            setError(scanError.message);
          }
        });
      } catch (scanError) {
        if (!active) return;
        setCameraOpen(false);
        setError(
          scanError?.name === "NotAllowedError"
            ? "Allow camera access to scan the device pairing QR code."
            : scanError?.message || "Unable to start the QR scanner.",
        );
      }
    };
    startScanner();

    return () => {
      active = false;
      reader?.reset();
      if (scannerRef.current === reader) scannerRef.current = null;
    };
  }, [cameraOpen]);

  const scanQrCode = () => {
    setError("");
    setMessage("");
    setQrData(null);
    setCameraOpen(true);
  };

  const cancelScan = () => {
    scannerRef.current?.reset();
    scannerRef.current = null;
    setCameraOpen(false);
  };

  const connectAndPair = async () => {
    const bluetoothError = getBluetoothSupport();
    if (bluetoothError) {
      setError(bluetoothError);
      return;
    }
    if (!qrData) {
      setError("Scan the one-time device pairing QR code first.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("Select the TrailGuard wearable in the Bluetooth prompt.");
    onConnectionState?.("SCANNING");
    let server;
    let keepConnection = false;
    let stopNotifications;
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [DEVICE_PAIRING_SERVICE_UUID] }],
      });
      onConnectionState?.("CONNECTING");
      if (!device.gatt) {
        throw new Error("This browser could not open a BLE connection to the wearable.");
      }
      let connectionTimedOut = false;
      const connectPromise = device.gatt.connect();
      connectPromise.then((lateServer) => {
        if (connectionTimedOut && lateServer.connected) lateServer.disconnect();
      }).catch(() => {});
      try {
        server = await withBleTimeout(
          connectPromise,
          BLE_CONNECT_TIMEOUT_MS,
          "BLE connection",
        );
      } catch (connectError) {
        connectionTimedOut = true;
        throw connectError;
      }
      onConnectionState?.("AUTHENTICATING");
      setMessage("Reading device identity; press the wearable pairing button if needed.");
      const service = await withBleTimeout(
        server.getPrimaryService(DEVICE_PAIRING_SERVICE_UUID),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE service discovery",
      );
      const infoCharacteristic = await withBleTimeout(
        service.getCharacteristic(DEVICE_INFORMATION_CHARACTERISTIC_UUID),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE device information discovery",
      );
      const infoValue = await withBleTimeout(
        infoCharacteristic.readValue(),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE device information read",
      );
      const info = parseDeviceInformation(new TextDecoder().decode(infoValue));
      if (info.deviceId !== qrData.deviceId) {
        throw new Error("The QR code and connected wearable identify different devices.");
      }
      const statusCharacteristic = await withBleTimeout(
        service.getCharacteristic(DEVICE_STATUS_CHARACTERISTIC_UUID),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE status characteristic discovery",
      );
      const statusValue = await withBleTimeout(
        statusCharacteristic.readValue(),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE protocol negotiation",
      );
      parseDeviceStatus(new TextDecoder().decode(statusValue));

      setMessage("Requesting a secure pairing challenge.");
      const challenge = await withBleTimeout(
        devicePairingApi.start(qrData.deviceId, qrData.bootstrapToken),
        BLE_AUTHENTICATION_TIMEOUT_MS,
        "Pairing challenge request",
      );
      const commandCharacteristic = await withBleTimeout(
        service.getCharacteristic(COMMAND_CHARACTERISTIC_UUID),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE command characteristic discovery",
      );
      const challengePayload = createPairingChallengePayload({
        ...challenge,
      });
      if (new TextEncoder().encode(challengePayload).length > 512) {
        throw new Error("Pairing challenge exceeds the supported BLE payload size.");
      }
      await withBleTimeout(
        commandCharacteristic.writeValueWithResponse(
          new TextEncoder().encode(challengePayload),
        ),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE pairing challenge write",
      );
      const proofValue = await withBleTimeout(
        commandCharacteristic.readValue(),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE pairing proof read",
      );
      const proof = parsePairingProof(new TextDecoder().decode(proofValue));

      setMessage("Verifying device proof and completing pairing.");
      const completion = await devicePairingApi.complete(
        challenge.challengeId,
        proof,
      );
      if (!completion.receipt) {
        throw new Error("The backend did not return a signed device authorization receipt.");
      }
      const authorizationCharacteristic = await withBleTimeout(
        service.getCharacteristic(AUTHORIZATION_CHARACTERISTIC_UUID),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE authorization characteristic discovery",
      );
      try {
        await withBleTimeout(
          authorizationCharacteristic.writeValueWithResponse(
            new TextEncoder().encode(
              serializeAuthorizationReceipt(completion.receipt),
            ),
          ),
          BLE_CONNECT_TIMEOUT_MS,
          "BLE owner receipt installation",
        );
      } catch (error) {
        if (device.gatt.connected) {
          throw new BleAuthorizationError(
            "The wearable rejected its signed owner receipt.",
            { cause: error },
          );
        }
        throw error;
      }

      const authorizationValue = await withBleTimeout(
        authorizationCharacteristic.readValue(),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE telemetry challenge read",
      );
      const authorizationChallenge = parseAuthorizationChallenge(
        new TextDecoder().decode(authorizationValue),
      );
      if (authorizationChallenge.deviceId !== qrData.deviceId) {
        throw new Error("The BLE authorization challenge belongs to another device.");
      }
      const { receipt: telemetryReceipt } =
        await withBleTimeout(
          devicePairingApi.telemetryReceipt(
            authorizationChallenge.deviceId,
            authorizationChallenge.challengeId,
            authorizationChallenge.nonce,
          ),
          BLE_AUTHENTICATION_TIMEOUT_MS,
          "Telemetry authorization request",
        );
      try {
        await withBleTimeout(
          authorizationCharacteristic.writeValueWithResponse(
            new TextEncoder().encode(
              serializeAuthorizationReceipt(telemetryReceipt),
            ),
          ),
          BLE_CONNECT_TIMEOUT_MS,
          "BLE telemetry receipt installation",
        );
      } catch (error) {
        if (device.gatt.connected) {
          throw new BleAuthorizationError(
            "The wearable rejected its signed telemetry receipt.",
            { cause: error },
          );
        }
        throw error;
      }
      const telemetryCharacteristic = await withBleTimeout(
        service.getCharacteristic("6f2a0002-7b1c-4d90-a5e2-8c1d3f6a0001"),
        BLE_CONNECT_TIMEOUT_MS,
        "BLE telemetry characteristic discovery",
      );
      stopNotifications = await subscribeToTelemetry(telemetryCharacteristic, {
        deviceId: qrData.deviceId,
        assertAuthenticatedConnection: async () => true,
        onTelemetry,
        onDiagnostic: (diagnostic) => {
          if (diagnostic.code !== "sequence_gap_timeout") {
            console.warn("[BLE telemetry] Frame rejected:", diagnostic.code);
          }
        },
      });

      setQrData(null);
      try {
        await onPaired?.();
      } catch (refreshError) {
        setError(
          `Pairing succeeded, but the device list could not refresh: ${refreshError.message}`,
        );
      }
      onTelemetrySession?.({
        device,
        deviceId: info.deviceId,
        server,
        stopNotifications,
        statusCharacteristic,
        initialDeviceStatus: parseDeviceStatus(
          new TextDecoder().decode(
            await withBleTimeout(
              statusCharacteristic.readValue(),
              BLE_CONNECT_TIMEOUT_MS,
              "BLE device status refresh",
            ),
          ),
        ),
      });
      keepConnection = true;
      setMessage(`${info.deviceId} was paired and telemetry link authorized.`);
    } catch (pairingError) {
      await stopNotifications?.();
      onConnectionState?.(
        isBleAuthorizationFailure(pairingError) ? "UNAUTHORIZED" : "DISCONNECTED",
      );
      setError(pairingError?.message || "Device pairing failed.");
      setMessage("");
    } finally {
      if (!keepConnection && server?.connected) server.disconnect();
      setBusy(false);
    }
  };

  const bluetoothError = getBluetoothSupport();

  return (
    <section className="mb-5 rounded-2xl border border-teal-400/20 bg-teal-400/5 p-4">
      <h4 className="text-sm font-semibold text-[var(--color-text)]">
        Pair TrailGuard Wearable
      </h4>
      <ol className="mt-2 list-inside list-decimal space-y-1 text-xs leading-5 text-[var(--color-text-secondary)]">
        <li>Scan the sealed one-time pairing QR code.</li>
        <li>Press the physical pairing button on the wearable.</li>
        <li>Connect over Bluetooth while the device advertises.</li>
      </ol>

      {cameraOpen && (
        <div className="mt-4 space-y-2">
          <video
            ref={videoRef}
            className="aspect-video w-full rounded-xl bg-black object-cover"
            muted
            playsInline
          />
          <button
            type="button"
            onClick={cancelScan}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs"
          >
            Cancel scan
          </button>
        </div>
      )}

      {qrData && (
        <p className="mt-3 break-all rounded-lg bg-[var(--color-surface-alt)] p-2 font-mono text-xs">
          Device: {qrData.deviceId}
        </p>
      )}

      {message && (
        <p role="status" className="mt-3 text-xs text-emerald-600">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-xs text-red-500">
          {error}
        </p>
      )}
      {bluetoothError && (
        <p className="mt-3 text-xs text-amber-600">{bluetoothError}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={scanQrCode}
          disabled={busy || cameraOpen}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold disabled:opacity-50"
        >
          Scan pairing QR
        </button>
        <button
          type="button"
          onClick={connectAndPair}
          disabled={busy || !qrData || Boolean(bluetoothError)}
          className="rounded-xl bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#06202D] disabled:opacity-50"
        >
          {busy ? "Pairing…" : "Connect and pair"}
        </button>
      </div>
    </section>
  );
}
