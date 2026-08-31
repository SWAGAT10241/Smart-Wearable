import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { devicesApi } from "../lib/apiClient";

const DeviceContext = createContext(null);

const STORAGE_KEY = "trailguard_selected_device";

export function DeviceProvider({ children }) {
  const [devices, setDevices] = useState([]);

  const [selectedDeviceId, setSelectedDeviceIdState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * ----------------------------------------------------------
   * Load all devices belonging to the authenticated user
   * ----------------------------------------------------------
   */

  const loadDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await devicesApi.all();

      const nextDevices = Array.isArray(response)
        ? response
        : Array.isArray(response?.devices)
          ? response.devices
          : [];

      setDevices(nextDevices);

      /*
       * Keep the currently selected device if it still exists.
       * Otherwise select the first available device.
       */

      const savedId = localStorage.getItem(STORAGE_KEY);

      const savedDevice = nextDevices.find(
        (device) => device.deviceId === savedId,
      );

      if (savedDevice) {
        setSelectedDeviceIdState(savedDevice.deviceId);
      } else if (nextDevices.length > 0) {
        setSelectedDeviceIdState(nextDevices[0].deviceId);
        localStorage.setItem(STORAGE_KEY, nextDevices[0].deviceId);
      } else {
        setSelectedDeviceIdState(null);
        localStorage.removeItem(STORAGE_KEY);
      }

      return nextDevices;
    } catch (err) {
      console.error("[DeviceContext] Failed to load devices:", err);

      setDevices([]);
      setSelectedDeviceIdState(null);
      localStorage.removeItem(STORAGE_KEY);

      setError(err);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * ----------------------------------------------------------
   * One-time device registration / activation
   * ----------------------------------------------------------
   *
   * The logged-in user claims the physical TrailGuard device.
   *
   * IMPORTANT:
   * - deviceId comes from the wearable
   * - userId comes from the authenticated JWT
   * - frontend does NOT send userId
   * ----------------------------------------------------------
   */

  const registerDevice = useCallback(
    async (deviceId, deviceName = "TrailGuard Wearable") => {
      if (!deviceId || !String(deviceId).trim()) {
        throw new Error("Device ID is required");
      }

      const normalizedDeviceId = String(deviceId).trim().toUpperCase();

      const normalizedDeviceName =
        String(deviceName || "").trim() || "TrailGuard Wearable";

      const response = await devicesApi.register(
        normalizedDeviceId,
        normalizedDeviceName,
      );

      /*
       * Reload devices so the newly connected device
       * immediately appears in the application.
       */
      await loadDevices();

      return response?.device || response;
    },
    [loadDevices],
  );

  /*
   * ----------------------------------------------------------
   * Load devices when provider starts
   * ----------------------------------------------------------
   */

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  /*
   * ----------------------------------------------------------
   * Select device
   * ----------------------------------------------------------
   */

  const selectDevice = useCallback((deviceId) => {
    if (!deviceId) {
      setSelectedDeviceIdState(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    setSelectedDeviceIdState(deviceId);
    localStorage.setItem(STORAGE_KEY, deviceId);
  }, []);

  /*
   * ----------------------------------------------------------
   * Rename device
   *
   * IMPORTANT:
   * deviceId never changes.
   * Only the user-facing name changes.
   * ----------------------------------------------------------
   */

  const renameDevice = useCallback(async (deviceId, name) => {
    if (!deviceId) {
      throw new Error("Device ID is required");
    }

    const trimmedName = String(name || "").trim();

    if (!trimmedName) {
      throw new Error("Device name cannot be empty");
    }

    const response = await devicesApi.rename(deviceId, trimmedName);

    const updatedDevice = response?.device || response;

    setDevices((currentDevices) =>
      currentDevices.map((device) =>
        device.deviceId === deviceId
          ? {
              ...device,
              ...updatedDevice,
              deviceId,
              name:
                updatedDevice?.name || updatedDevice?.deviceName || trimmedName,
            }
          : device,
      ),
    );

    return updatedDevice;
  }, []);

  /*
   * ----------------------------------------------------------
   * Remove device
   * ----------------------------------------------------------
   */

  const removeDevice = useCallback(
    async (deviceId) => {
      if (!deviceId) {
        throw new Error("Device ID is required");
      }

      await devicesApi.remove(deviceId);

      const remainingDevices = devices.filter(
        (device) => device.deviceId !== deviceId,
      );

      setDevices(remainingDevices);

      /*
       * If the removed device was selected,
       * automatically select another device.
       */

      if (selectedDeviceId === deviceId) {
        const nextDevice = remainingDevices[0];

        if (nextDevice) {
          selectDevice(nextDevice.deviceId);
        } else {
          setSelectedDeviceIdState(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    },
    [devices, selectedDeviceId, selectDevice],
  );

  /*
   * ----------------------------------------------------------
   * Currently selected device
   * ----------------------------------------------------------
   */

  const selectedDevice = useMemo(() => {
    if (!selectedDeviceId) {
      return null;
    }

    return (
      devices.find((device) => device.deviceId === selectedDeviceId) || null
    );
  }, [devices, selectedDeviceId]);

  /*
   * ----------------------------------------------------------
   * Context value
   * ----------------------------------------------------------
   */

  const value = useMemo(
    () => ({
      devices,
      loading,
      error,

      selectedDeviceId,
      selectedDevice,

      selectDevice,
      registerDevice,

      renameDevice,
      removeDevice,

      refreshDevices: loadDevices,
    }),
    [
      devices,
      loading,
      error,
      selectedDeviceId,
      selectedDevice,
      selectDevice,
      registerDevice,
      renameDevice,
      removeDevice,
      loadDevices,
    ],
  );

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);

  if (!context) {
    throw new Error("useDevices must be used inside a DeviceProvider");
  }

  return context;
}
