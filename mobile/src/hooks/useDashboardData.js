import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useDevices } from "../context/DeviceContext";
import { useLiveData } from "../context/LiveDataContext";

/**
 * Custom hook encapsulating dashboard telemetry parsing, statuses, and device state for Mobile.
 *
 * @returns {object} Dashboard metrics, device state, and actions
 */
export function useDashboardData() {
  const { user } = useAuth();
  const { selectedDevice, selectedDeviceId } = useDevices();
  const {
    vitals,
    environment,
    location,
    falls,
    connected,
    loading,
    refresh,
  } = useLiveData();

  const heartRate = vitals?.heartRate ?? vitals?.hr ?? vitals?.heart_rate;
  const spo2 = vitals?.spo2 ?? vitals?.oxygenSaturation ?? vitals?.oxygen;
  const temperature = environment?.temperature ?? vitals?.temperature ?? vitals?.temp;
  const humidity = environment?.humidity ?? vitals?.humidity;
  const pressure = environment?.pressure ?? vitals?.pressure;

  const hrStatus = useMemo(() => {
    if (heartRate == null) return "normal";
    return heartRate < 50 || heartRate > 120 ? "danger" : "success";
  }, [heartRate]);

  const spo2Status = useMemo(() => {
    if (spo2 == null) return "normal";
    return spo2 < 94 ? "danger" : "success";
  }, [spo2]);

  const recentFalls = useMemo(() => {
    return Array.isArray(falls) ? falls.slice(0, 3) : [];
  }, [falls]);

  return {
    user,
    selectedDevice,
    selectedDeviceId,
    vitals,
    environment,
    location,
    falls,
    recentFalls,
    connected,
    loading,
    refresh,
    metrics: {
      heartRate,
      spo2,
      temperature,
      humidity,
      pressure,
    },
    statuses: {
      heartRate: hrStatus,
      spo2: spo2Status,
    },
  };
}

export default useDashboardData;

