import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useDevices } from "./DeviceContext";
import {
  AUTHORIZATION_CHARACTERISTIC_UUID,
  DEVICE_PAIRING_SERVICE_UUID,
} from "../lib/devicePairing";
import { devicePairingApi } from "../lib/apiClient";
import {
  serializeAuthorizationReceipt,
  parseAuthorizationChallenge,
} from "../lib/devicePairing";
import { subscribeToTelemetry } from "../lib/telemetryBleClient";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/live";
const TELEMETRY_CHARACTERISTIC_UUID =
  "6f2a0002-7b1c-4d90-a5e2-8c1d3f6a0001";
const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const { selectedDeviceId } = useDevices();
  const [connected, setConnected] = useState(false);
  const [bleConnected, setBleConnected] = useState(false);
  const [vitals, setVitals] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [location, setLocation] = useState(null);
  const [activeFall, setActiveFall] = useState(null);
  const [vitalsUpdatedAt, setVitalsUpdatedAt] = useState(null);
  const [environmentUpdatedAt, setEnvironmentUpdatedAt] = useState(null);
  const [locationUpdatedAt, setLocationUpdatedAt] = useState(null);
  const listenersRef = useRef(new Set());
  const bleSessionRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const stoppedRef = useRef(false);

  /*
   * ----------------------------------------------------------
   * Clear data when device changes
   * ----------------------------------------------------------
   */

  useEffect(() => {
    setVitals(null);
    setEnvironment(null);
    setLocation(null);
    setActiveFall(null);
    setVitalsUpdatedAt(null);
    setEnvironmentUpdatedAt(null);
    setLocationUpdatedAt(null);
  }, [selectedDeviceId]);

  useEffect(() => {
    const session = bleSessionRef.current;
    if (session && selectedDeviceId !== session.deviceId) {
      session.dispose();
      bleSessionRef.current = null;
    }
  }, [selectedDeviceId]);

  useEffect(
    () => () => {
      bleSessionRef.current?.dispose();
      bleSessionRef.current = null;
    },
    [],
  );

  /*
   * ----------------------------------------------------------
   * WebSocket message
   * ----------------------------------------------------------
   */

  const onMessage = useCallback(
    (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        console.warn("[LiveData] Invalid WebSocket message:", event.data);
        return;
      }
      if (!msg?.type) {
        return;
      }

      /*
       * Ignore messages belonging
       * to another selected device.
       */

      const messageDeviceId = msg.deviceId || msg.data?.deviceId;
      if (!selectedDeviceId) {
        return;
      }
      if (!messageDeviceId) {
        return;
      }
      if (
        messageDeviceId.trim().toUpperCase() !==
        selectedDeviceId.trim().toUpperCase()
      ) {
        return;
      }

      /*
       * Prefer backend timestamp.
       * Otherwise use the time the
       * browser received the message.
       */

      const messageTimestamp =
        msg.data?.timestamp ||
        msg.data?.createdAt ||
        msg.data?.recordedAt ||
        msg.timestamp ||
        new Date().toISOString();

      switch (msg.type) {
        /* -----------------------------------------------
         * VITALS
         * --------------------------------------------- */

        case "vitals": {
          const data = {
            ...(msg.data || {}),
            _receivedAt: messageTimestamp,
          };
          setVitals(data);
          setVitalsUpdatedAt(messageTimestamp);
          break;
        }

        /* -----------------------------------------------
         * ENVIRONMENT
         * --------------------------------------------- */

        case "environment": {
          const data = {
            ...(msg.data || {}),
            _receivedAt: messageTimestamp,
          };
          setEnvironment(data);
          setEnvironmentUpdatedAt(messageTimestamp);
          break;
        }

        /* -----------------------------------------------
         * LOCATION
         * --------------------------------------------- */

        case "location": {
          const data = {
            ...(msg.data || {}),
            _receivedAt: messageTimestamp,
          };
          setLocation(data);
          setLocationUpdatedAt(messageTimestamp);
          break;
        }

        /* -----------------------------------------------
         * FALL
         * --------------------------------------------- */

        case "fall_detected":
          setActiveFall(msg.data || null);
          break;

        /* -----------------------------------------------
         * FALL STATUS
         * --------------------------------------------- */

        case "fall_status_update":
          setActiveFall((previousFall) => {
            if (!previousFall || previousFall._id !== msg.data?._id) {
              return previousFall;
            }
            const resolvedStatuses = ["confirmed_false_alarm", "resolved"];
            if (resolvedStatuses.includes(msg.data?.status)) {
              return null;
            }
            return msg.data;
          });
          break;
        default:
          break;
      }

      /*
       * Notify external subscribers.
       */

      listenersRef.current.forEach((listener) => {
        try {
          listener(msg);
        } catch (error) {
          console.error("[LiveData] Listener error:", error);
        }
      });
    },
    [selectedDeviceId],
  );

  /*
   * ----------------------------------------------------------
   * Connect WebSocket
   * ----------------------------------------------------------
   */

  const connect = useCallback(() => {
    if (stoppedRef.current) {
      return;
    }
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN)
    ) {
      return;
    }
    console.log("[LiveData] Connecting:", WS_URL);
    let ws;
    try {
      ws = new WebSocket(WS_URL);
    } catch (error) {
      console.error("[LiveData] Failed to create WebSocket:", error);
      setConnected(false);
      return;
    }

    wsRef.current = ws;
    ws.onopen = () => {
      if (stoppedRef.current) {
        ws.close();
        return;
      }

      console.log("[LiveData] WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = onMessage;
    ws.onerror = (error) => {
      console.error("[LiveData] WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.warn(
        `[LiveData] WebSocket closed. code=${event.code} reason=${
          event.reason || "none"
        }`,
      );
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
      setConnected(false);
      if (stoppedRef.current) {
        return;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null;
        connect();
      }, 3000);
    };
  }, [onMessage]);

  /*
   * ----------------------------------------------------------
   * WebSocket lifecycle
   * ----------------------------------------------------------
   */

  useEffect(() => {
    stoppedRef.current = false;
    connect();
    return () => {
      stoppedRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      const ws = wsRef.current;
      wsRef.current = null;
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        if (
          ws.readyState === WebSocket.CONNECTING ||
          ws.readyState === WebSocket.OPEN
        ) {
          ws.close();
        }
      }
      setConnected(false);
    };
  }, [connect]);

  /*
   * ----------------------------------------------------------
   * Subscribe
   * ----------------------------------------------------------
   */

  const subscribe = useCallback((listener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * Dismiss fall
   * ----------------------------------------------------------
   */

  const dismissFall = useCallback(() => {
    setActiveFall(null);
  }, []);

  const ingestTelemetryFrame = useCallback((frame) => {
    const { payload } = frame;
    setVitals({
      deviceId: frame.deviceId,
      heartRate: payload.heartRateBpm,
      spo2: payload.spo2Percent,
      timestamp: frame.timestamp,
      sequence: frame.sequence,
    });
    setEnvironment({
      deviceId: frame.deviceId,
      temperature: payload.temperatureC,
      batteryPercent: payload.batteryPercent,
      charging: payload.charging,
      sensorHealth: payload.sensorHealth,
      riskEngineStatus: payload.riskEngineStatus,
      timestamp: frame.timestamp,
      sequence: frame.sequence,
    });
    setVitalsUpdatedAt(frame.timestamp);
    setEnvironmentUpdatedAt(frame.timestamp);
  }, []);

  const attachBleTelemetrySession = useCallback(
    ({ device, deviceId, server, stopNotifications }) => {
      if (bleSessionRef.current) {
        bleSessionRef.current.dispose();
      }
      const normalizedDeviceId = deviceId || selectedDeviceId;
      if (!normalizedDeviceId) {
        throw new Error("A selected device is required for BLE telemetry.");
      }

      let active = true;
      let reconnectTimer = null;
      let stopCurrentNotifications = stopNotifications;
      let reconnectAttempt = 0;
      const session = {
        device,
        server,
        deviceId: normalizedDeviceId,
        dispose: () => {
          if (!active) return;
          active = false;
          if (reconnectTimer) clearTimeout(reconnectTimer);
          device.removeEventListener("gattserverdisconnected", handleDisconnect);
          void stopCurrentNotifications?.();
          if (device.gatt?.connected) device.gatt.disconnect();
          setBleConnected(false);
        },
      };

      const authorizeConnection = async (connectedServer) => {
        const service = await connectedServer.getPrimaryService(
          DEVICE_PAIRING_SERVICE_UUID,
        );
        const authorization = await service.getCharacteristic(
          AUTHORIZATION_CHARACTERISTIC_UUID,
        );
        const challengeValue = await authorization.readValue();
        const challenge = parseAuthorizationChallenge(
          new TextDecoder().decode(challengeValue),
        );
        if (challenge.deviceId !== session.deviceId.toUpperCase()) {
          throw new Error("BLE telemetry challenge belongs to a different device.");
        }
        const { receipt } = await devicePairingApi.telemetryReceipt(
          challenge.deviceId,
          challenge.challengeId,
          challenge.nonce,
        );
        await authorization.writeValueWithResponse(
          new TextEncoder().encode(serializeAuthorizationReceipt(receipt)),
        );
        const telemetry = await service.getCharacteristic(
          TELEMETRY_CHARACTERISTIC_UUID,
        );
        stopCurrentNotifications = await subscribeToTelemetry(telemetry, {
          deviceId: session.deviceId,
          assertAuthenticatedConnection: async () => true,
          onTelemetry: ingestTelemetryFrame,
          onDiagnostic: (diagnostic) => {
            if (diagnostic.code !== "sequence_gap_timeout") {
              console.warn("[BLE telemetry] Frame rejected:", diagnostic.code);
            }
          },
        });
        reconnectAttempt = 0;
        setBleConnected(true);
      };

      const handleDisconnect = () => {
        setBleConnected(false);
        void stopCurrentNotifications?.();
        if (!active) return;
        const delay = Math.min(1000 * 2 ** reconnectAttempt, 30_000);
        reconnectAttempt += 1;
        reconnectTimer = setTimeout(async () => {
          reconnectTimer = null;
          if (!active) return;
          try {
            const connectedServer = await device.gatt.connect();
            session.server = connectedServer;
            await authorizeConnection(connectedServer);
          } catch (error) {
            console.error("[BLE telemetry] Reconnection failed:", error);
            handleDisconnect();
          }
        }, delay);
      };

      session.server = server;
      bleSessionRef.current = session;
      device.addEventListener("gattserverdisconnected", handleDisconnect);
      setBleConnected(true);
      return session.dispose;
    },
    [ingestTelemetryFrame, selectedDeviceId],
  );

  /*
   * ----------------------------------------------------------
   * Context
   * ----------------------------------------------------------
   */

  const value = {
    connected,
    bleConnected,
    selectedDeviceId,
    vitals,
    environment,
    location,
    activeFall,
    vitalsUpdatedAt,
    environmentUpdatedAt,
    locationUpdatedAt,
    subscribe,
    dismissFall,
    ingestTelemetryFrame,
    attachBleTelemetrySession,
  };

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error("useLiveData must be used inside a LiveDataProvider");
  }

  return context;
}
