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
  DEVICE_STATUS_CHARACTERISTIC_UUID,
  DEVICE_PAIRING_SERVICE_UUID,
} from "../lib/devicePairing";
import { devicePairingApi } from "../lib/apiClient";
import {
  serializeAuthorizationReceipt,
  parseAuthorizationChallenge,
  parseDeviceStatus,
} from "../lib/devicePairing";
import { subscribeToTelemetry } from "../lib/telemetryBleClient";
import {
  BLE_AUTHENTICATION_TIMEOUT_MS,
  BLE_CONNECT_TIMEOUT_MS,
  BLE_STALE_TIMEOUT_MS,
  BleAuthorizationError,
  getBleReconnectDelay,
  isBleAuthorizationFailure,
  withBleTimeout,
} from "../lib/bleConnection";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/live";
const TELEMETRY_CHARACTERISTIC_UUID =
  "6f2a0002-7b1c-4d90-a5e2-8c1d3f6a0001";
const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const { selectedDeviceId } = useDevices();
  const [connected, setConnected] = useState(false);
  const [bleConnected, setBleConnected] = useState(false);
  const [bleConnectionState, setBleConnectionState] = useState("DISCONNECTED");
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [deviceStatusUpdatedAt, setDeviceStatusUpdatedAt] = useState(null);
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
    setDeviceStatus(null);
    setDeviceStatusUpdatedAt(null);
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
    ({
      device,
      deviceId,
      server,
      stopNotifications,
      statusCharacteristic,
      initialDeviceStatus,
    }) => {
      if (bleSessionRef.current) {
        bleSessionRef.current.dispose();
      }
      const normalizedDeviceId = deviceId || selectedDeviceId;
      if (!normalizedDeviceId) {
        throw new Error("A selected device is required for BLE telemetry.");
      }

      let active = true;
      let reconnectTimer = null;
      let staleTimer = null;
      let statusPollTimer = null;
      let statusReadInProgress = false;
      let currentStatusCharacteristic = null;
      let stopCurrentNotifications = stopNotifications;
      let reconnectAttempt = 0;
      let connectionAttemptInProgress = false;
      let reconnectRequested = false;
      let connectionReady = true;
      let lastTelemetryAt = Date.now();
      currentStatusCharacteristic = statusCharacteristic;
      const updateConnectionState = (state) => {
        if (active) setBleConnectionState(state);
      };
      const clearCurrentNotifications = () => {
        const stop = stopCurrentNotifications;
        stopCurrentNotifications = null;
        void stop?.().catch((error) => {
          console.error("[BLE telemetry] Failed to stop notifications:", error);
        });
      };
      const session = {
        device,
        server,
        deviceId: normalizedDeviceId,
        dispose: () => {
          if (!active) return;
          active = false;
          if (reconnectTimer) clearTimeout(reconnectTimer);
          if (staleTimer) clearInterval(staleTimer);
          if (statusPollTimer) clearInterval(statusPollTimer);
          connectionReady = false;
          device.removeEventListener("gattserverdisconnected", handleDisconnect);
          clearCurrentNotifications();
          if (device.gatt?.connected) device.gatt.disconnect();
          setBleConnected(false);
          setBleConnectionState("DISCONNECTED");
          if (bleSessionRef.current === session) {
            bleSessionRef.current = null;
          }
        },
      };

      const startStatusPolling = () => {
        if (statusPollTimer) return;
        statusPollTimer = setInterval(async () => {
          if (
            !active ||
            !device.gatt?.connected ||
            !currentStatusCharacteristic ||
            statusReadInProgress
          ) {
            return;
          }
          statusReadInProgress = true;
          try {
            const status = parseDeviceStatus(
              new TextDecoder().decode(
                await withBleTimeout(
                  currentStatusCharacteristic.readValue(),
                  BLE_CONNECT_TIMEOUT_MS,
                  "BLE device status refresh",
                ),
              ),
            );
            if (!active) return;
            setDeviceStatus(status);
            setDeviceStatusUpdatedAt(new Date().toISOString());
          } catch (error) {
            console.error("[BLE telemetry] Device status refresh failed:", error);
          } finally {
            statusReadInProgress = false;
          }
        }, 30_000);
      };

      const authorizeConnection = async (connectedServer, attempt) => {
        const assertAttemptActive = () => {
          if (!active || attempt.cancelled) {
            throw new Error("BLE connection attempt is no longer active.");
          }
        };
        assertAttemptActive();
        const service = await connectedServer.getPrimaryService(
          DEVICE_PAIRING_SERVICE_UUID,
        );
        assertAttemptActive();
        const statusCharacteristic = await service.getCharacteristic(
          DEVICE_STATUS_CHARACTERISTIC_UUID,
        );
        currentStatusCharacteristic = statusCharacteristic;
        assertAttemptActive();
        const initialStatus = parseDeviceStatus(
          new TextDecoder().decode(await statusCharacteristic.readValue()),
        );
        assertAttemptActive();
        setDeviceStatus(initialStatus);
        setDeviceStatusUpdatedAt(new Date().toISOString());
        const authorization = await service.getCharacteristic(
          AUTHORIZATION_CHARACTERISTIC_UUID,
        );
        assertAttemptActive();
        const challengeValue = await authorization.readValue();
        assertAttemptActive();
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
        assertAttemptActive();
        try {
          await authorization.writeValueWithResponse(
            new TextEncoder().encode(serializeAuthorizationReceipt(receipt)),
          );
        } catch (error) {
          if (device.gatt?.connected) {
            throw new BleAuthorizationError(
              "The wearable rejected its signed telemetry receipt.",
              { cause: error },
            );
          }
          throw error;
        }
        assertAttemptActive();
        const telemetry = await service.getCharacteristic(
          TELEMETRY_CHARACTERISTIC_UUID,
        );
        assertAttemptActive();
        stopCurrentNotifications = await subscribeToTelemetry(telemetry, {
          deviceId: session.deviceId,
          assertAuthenticatedConnection: async () => true,
          onTelemetry: (frame) => {
            if (!active || !device.gatt?.connected) return;
            lastTelemetryAt = Date.now();
            connectionReady = true;
            updateConnectionState("CONNECTED");
            ingestTelemetryFrame(frame);
          },
          onDiagnostic: (diagnostic) => {
            if (diagnostic.code !== "sequence_gap_timeout") {
              console.warn("[BLE telemetry] Frame rejected:", diagnostic.code);
            }
          },
        });
        if (!active || attempt.cancelled) {
          clearCurrentNotifications();
          throw new Error("BLE connection attempt is no longer active.");
        }
        const authorizedStatus = parseDeviceStatus(
          new TextDecoder().decode(await statusCharacteristic.readValue()),
        );
        if (!active || attempt.cancelled) {
          clearCurrentNotifications();
          throw new Error("BLE connection attempt is no longer active.");
        }
        setDeviceStatus(authorizedStatus);
        setDeviceStatusUpdatedAt(new Date().toISOString());
        lastTelemetryAt = Date.now();
        reconnectAttempt = 0;
        connectionReady = true;
        setBleConnected(true);
        updateConnectionState("CONNECTED");
        startStatusPolling();
      };

      const scheduleReconnect = () => {
        if (!active || reconnectTimer) return;
        if (connectionAttemptInProgress) {
          reconnectRequested = true;
          return;
        }
        setBleConnected(false);
        connectionReady = false;
        updateConnectionState("RECONNECTING");
        const delay = getBleReconnectDelay(reconnectAttempt);
        reconnectAttempt += 1;
        reconnectTimer = setTimeout(async () => {
          reconnectTimer = null;
          if (!active || connectionAttemptInProgress) return;
          connectionAttemptInProgress = true;
          const attempt = { cancelled: false };
          try {
            const connectPromise = device.gatt.connect();
            connectPromise.then((lateServer) => {
              if (!active || attempt.cancelled) {
                if (lateServer.connected) lateServer.disconnect();
              }
            }).catch(() => {});
            const connectedServer = await withBleTimeout(
              connectPromise,
              BLE_CONNECT_TIMEOUT_MS,
              "BLE connection",
            );
            if (!active || attempt.cancelled) {
              if (connectedServer.connected) connectedServer.disconnect();
              return;
            }
            session.server = connectedServer;
            updateConnectionState("AUTHENTICATING");
            await withBleTimeout(
              authorizeConnection(connectedServer, attempt),
              BLE_AUTHENTICATION_TIMEOUT_MS,
              "BLE authentication",
            );
          } catch (error) {
            attempt.cancelled = true;
            if (isBleAuthorizationFailure(error)) {
              console.error("[BLE telemetry] Device authorization was rejected.");
              session.dispose();
              setBleConnectionState("UNAUTHORIZED");
              return;
            }
            console.error("[BLE telemetry] Reconnection failed:", error);
            if (device.gatt?.connected) device.gatt.disconnect();
            scheduleReconnect();
          } finally {
            connectionAttemptInProgress = false;
            if (reconnectRequested && active) {
              reconnectRequested = false;
              scheduleReconnect();
            }
          }
        }, delay);
      };

      const handleDisconnect = () => {
        setBleConnected(false);
        connectionReady = false;
        clearCurrentNotifications();
        if (!active) return;
        setBleConnectionState("RECONNECTING");
        scheduleReconnect();
      };

      session.server = server;
      bleSessionRef.current = session;
      device.addEventListener("gattserverdisconnected", handleDisconnect);
      setBleConnected(true);
      setBleConnectionState("CONNECTED");
      startStatusPolling();
      if (initialDeviceStatus) {
        setDeviceStatus(initialDeviceStatus);
        setDeviceStatusUpdatedAt(new Date().toISOString());
      }
      staleTimer = setInterval(() => {
        if (
          active &&
          connectionReady &&
          device.gatt?.connected &&
          Date.now() - lastTelemetryAt >= BLE_STALE_TIMEOUT_MS
        ) {
          setBleConnectionState("STALE");
        }
      }, 1000);
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
    bleConnectionState,
    setBleConnectionState,
    deviceStatus,
    deviceStatusUpdatedAt,
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
