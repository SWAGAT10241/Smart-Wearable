import { useEffect, useRef, useState } from "react";
import {
  COMMAND_CHARACTERISTIC_UUID,
  AUTHORIZATION_CHARACTERISTIC_UUID,
  DEVICE_INFORMATION_CHARACTERISTIC_UUID,
  DEVICE_PAIRING_SERVICE_UUID,
  createPairingChallengePayload,
  getBluetoothSupport,
  parseDeviceInformation,
  parsePairingProof,
  parsePairingQr,
  parseAuthorizationChallenge,
  serializeAuthorizationReceipt,
} from "../lib/devicePairing";
import { devicePairingApi } from "../lib/apiClient";
import { subscribeToTelemetry } from "../lib/telemetryBleClient";

export default function PairDevicePanel({
  onPaired,
  onTelemetry,
  onTelemetrySession,
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
    let server;
    let keepConnection = false;
    let stopNotifications;
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [DEVICE_PAIRING_SERVICE_UUID] }],
      });
      if (!device.gatt) {
        throw new Error("This browser could not open a BLE connection to the wearable.");
      }
      server = await device.gatt.connect();
      setMessage("Reading device identity; press the wearable pairing button if needed.");
      const service = await server.getPrimaryService(DEVICE_PAIRING_SERVICE_UUID);
      const infoCharacteristic = await service.getCharacteristic(
        DEVICE_INFORMATION_CHARACTERISTIC_UUID,
      );
      const infoValue = await infoCharacteristic.readValue();
      const info = parseDeviceInformation(new TextDecoder().decode(infoValue));
      if (info.deviceId !== qrData.deviceId) {
        throw new Error("The QR code and connected wearable identify different devices.");
      }

      setMessage("Requesting a secure pairing challenge.");
      const challenge = await devicePairingApi.start(
        qrData.deviceId,
        qrData.bootstrapToken,
      );
      const commandCharacteristic = await service.getCharacteristic(
        COMMAND_CHARACTERISTIC_UUID,
      );
      const challengePayload = createPairingChallengePayload({
        ...challenge,
      });
      if (new TextEncoder().encode(challengePayload).length > 512) {
        throw new Error("Pairing challenge exceeds the supported BLE payload size.");
      }
      await commandCharacteristic.writeValueWithResponse(
        new TextEncoder().encode(challengePayload),
      );
      const proofValue = await commandCharacteristic.readValue();
      const proof = parsePairingProof(new TextDecoder().decode(proofValue));

      setMessage("Verifying device proof and completing pairing.");
      const completion = await devicePairingApi.complete(
        challenge.challengeId,
        proof,
      );
      if (!completion.receipt) {
        throw new Error("The backend did not return a signed device authorization receipt.");
      }
      const authorizationCharacteristic = await service.getCharacteristic(
        AUTHORIZATION_CHARACTERISTIC_UUID,
      );
      await authorizationCharacteristic.writeValueWithResponse(
        new TextEncoder().encode(
          serializeAuthorizationReceipt(completion.receipt),
        ),
      );

      const authorizationValue = await authorizationCharacteristic.readValue();
      const authorizationChallenge = parseAuthorizationChallenge(
        new TextDecoder().decode(authorizationValue),
      );
      if (authorizationChallenge.deviceId !== qrData.deviceId) {
        throw new Error("The BLE authorization challenge belongs to another device.");
      }
      const { receipt: telemetryReceipt } =
        await devicePairingApi.telemetryReceipt(
          authorizationChallenge.deviceId,
          authorizationChallenge.challengeId,
          authorizationChallenge.nonce,
        );
      await authorizationCharacteristic.writeValueWithResponse(
        new TextEncoder().encode(
          serializeAuthorizationReceipt(telemetryReceipt),
        ),
      );
      const telemetryCharacteristic = await service.getCharacteristic(
        "6f2a0002-7b1c-4d90-a5e2-8c1d3f6a0001",
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
      });
      keepConnection = true;
      setMessage(`${info.deviceId} was paired and telemetry link authorized.`);
    } catch (pairingError) {
      await stopNotifications?.();
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
