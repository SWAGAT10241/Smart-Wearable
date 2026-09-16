import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { devicesApi } from "../lib/apiClient";
import { getSelectedDevice, saveSelectedDevice } from "../lib/storage";
const DeviceContext = createContext(null);

export function DeviceProvider({ children }) {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await devicesApi.all();
      const list = Array.isArray(response) ? response : response?.devices || [];
      setDevices(list);
      const saved = await getSelectedDevice();

      const savedDevice = list.find(
        (d) => d.deviceId === saved && d.status === "active",
      );

      const firstActive = list.find((d) => d.status === "active");
      const selected = savedDevice || firstActive || null;

      if (selected) {
        setSelectedDeviceId(selected.deviceId);
        await saveSelectedDevice(selected.deviceId);
      } else {
        setSelectedDeviceId(null);
        await saveSelectedDevice(null);
      }
    } catch (error) {
      console.log("Device loading error:", error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const selectDevice = useCallback(
    async (deviceId) => {
      const device = devices.find((d) => d.deviceId === deviceId);

      if (!device || device.status !== "active") {
        return;
      }

      setSelectedDeviceId(deviceId);
      await saveSelectedDevice(deviceId);
    },
    [devices],
  );

  const registerDevice = useCallback(
    async (deviceId, deviceName) => {
      const response = await devicesApi.register(
        deviceId.trim().toUpperCase(),
        deviceName || "TrailGuard Wearable",
      );

      await loadDevices();
      return response;
    },
    [loadDevices],
  );

  const renameDevice = useCallback(async (deviceId, name) => {
    const response = await devicesApi.rename(deviceId, name.trim());

    setDevices((current) =>
      current.map((device) =>
        device.deviceId === deviceId
          ? {
              ...device,
              deviceName: name.trim(),
            }
          : device,
      ),
    );

    return response;
  }, []);

  const removeDevice = useCallback(
    async (deviceId) => {
      await devicesApi.remove(deviceId);

      setDevices((current) =>
        current.filter((device) => device.deviceId !== deviceId),
      );

      if (selectedDeviceId === deviceId) {
        setSelectedDeviceId(null);
        await saveSelectedDevice(null);
      }
    },
    [selectedDeviceId],
  );

  const selectedDevice = useMemo(
    () =>
      devices.find(
        (device) =>
          device.deviceId === selectedDeviceId && device.status === "active",
      ) || null,
    [devices, selectedDeviceId],
  );

  return (
    <DeviceContext.Provider
      value={{
        devices,
        loading,
        selectedDeviceId,
        selectedDevice,
        selectDevice,
        registerDevice,
        renameDevice,
        removeDevice,
        refreshDevices: loadDevices,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  return useContext(DeviceContext);
}
