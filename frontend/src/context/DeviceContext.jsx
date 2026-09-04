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
       * Only ACTIVE devices can be selected.
       *
       * 1. Restore saved device if it still exists and is active.
       * 2. Otherwise select the first active device.
       * 3. If there are no active devices, clear selection.
       */

      const savedId = localStorage.getItem(STORAGE_KEY);

      const savedDevice = nextDevices.find(
        (device) => device.deviceId === savedId && device.status === "active",
      );

      const firstActiveDevice = nextDevices.find(
        (device) => device.status === "active",
      );

      if (savedDevice) {
        setSelectedDeviceIdState(savedDevice.deviceId);
      } else if (firstActiveDevice) {
        setSelectedDeviceIdState(firstActiveDevice.deviceId);
        localStorage.setItem(STORAGE_KEY, firstActiveDevice.deviceId);
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
      const normalizedDeviceName = String(deviceName || "").trim() || "TrailGuard Wearable";
      const response = await devicesApi.register(normalizedDeviceId,normalizedDeviceName);

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

  const selectDevice = useCallback(
    (deviceId) => {
      if (!deviceId) {
        setSelectedDeviceIdState(null);
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const device = devices.find((item) => item.deviceId === deviceId);

      if (!device) {
        return;
      }

      /*
       * Inactive devices cannot be selected.
       */
      if (device.status !== "active") {
        return;
      }

      setSelectedDeviceIdState(device.deviceId);
      localStorage.setItem(STORAGE_KEY, device.deviceId);
    },
    [devices],
  );

  /*
   * ----------------------------------------------------------
   * Rename device
   * ----------------------------------------------------------
   *
   * IMPORTANT:
   * deviceId never changes.
   * Only the user-facing deviceName changes.
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
              // deviceId must never change during rename
              deviceId,
              // Keep backend field consistent
              deviceName:
                updatedDevice?.deviceName || updatedDevice?.name || trimmedName,
            }
          : device,
      ),
    );
    return updatedDevice;
  }, []);

  /*
   * ----------------------------------------------------------
   * Update device status
   * ----------------------------------------------------------
   *
   * active   -> device can be selected and send readings
   * inactive -> device cannot be selected or send readings
   * ----------------------------------------------------------
   */

  const updateDeviceStatus = useCallback(
    async (deviceId, status) => {
      if (!deviceId) {
        throw new Error("Device ID is required");
      }
      if (!["active", "inactive"].includes(status)) {
        throw new Error("Status must be active or inactive");
      }
      const response = await devicesApi.setStatus(deviceId, status);
      const updatedDevice = response?.device || response;
      setDevices((currentDevices) =>
        currentDevices.map((device) =>
          device.deviceId === deviceId
            ? {
                ...device,
                ...updatedDevice,
                deviceId,
                status,
              }
            : device,
        ),
      );

      /*
       * If the currently selected device becomes inactive,
       * immediately clear the selection.
       */
      if (selectedDeviceId === deviceId && status === "inactive") {
        setSelectedDeviceIdState(null);
        localStorage.removeItem(STORAGE_KEY);
      }
      return updatedDevice;
    },
    [selectedDeviceId],
  );

  /*
   * ----------------------------------------------------------
   * Unpair / remove device
   * ----------------------------------------------------------
   *
   * Backend currently handles DELETE by marking the device
   * inactive rather than physically deleting telemetry.
   *
   * Historical readings therefore remain available in MongoDB.
   * ----------------------------------------------------------
   */

const removeDevice = useCallback(
  async (deviceId) => {
    if (!deviceId) {
      throw new Error("Device ID is required");
    }
    await devicesApi.remove(deviceId);
    setDevices((currentDevices) =>
      currentDevices.filter(
        (device) => device.deviceId !== deviceId,
      ),
    );

    /*
     * Unpairing the selected device clears the selection.
     */
    if (selectedDeviceId === deviceId) {
      setSelectedDeviceIdState(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  },
  [selectedDeviceId],
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

    const device = devices.find(
      (device) => device.deviceId === selectedDeviceId,
    );

    /*
     * Safety check:
     * an inactive device should never be considered selected.
     */
    if (!device || device.status !== "active") {
      return null;
    }

    return device;
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
      updateDeviceStatus,
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
      updateDeviceStatus,
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
