import { useState, useEffect, useCallback } from "react";
import { vitalsApi, environmentApi, locationApi, fallsApi } from "../lib/apiClient";
import { useDevices } from "../context/DeviceContext";

/**
 * Custom hook to fetch telemetry history by time window.
 *
 * @param {number} defaultHours
 */
export function useTelemetryHistory(defaultHours = 6) {
  const { selectedDeviceId } = useDevices();
  const [hours, setHours] = useState(defaultHours);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vitals, setVitals] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [locations, setLocations] = useState([]);
  const [falls, setFalls] = useState([]);

  const fetchHistory = useCallback(async () => {
    if (!selectedDeviceId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [vitalsData, envData, locData, fallsData] = await Promise.all([
        vitalsApi.history(selectedDeviceId, hours).catch(() => []),
        environmentApi.history(selectedDeviceId, hours).catch(() => []),
        locationApi.history(selectedDeviceId, hours).catch(() => []),
        fallsApi.all(selectedDeviceId).catch(() => []),
      ]);

      setVitals(Array.isArray(vitalsData) ? vitalsData : []);
      setEnvironment(Array.isArray(envData) ? envData : []);
      setLocations(Array.isArray(locData) ? locData : []);
      setFalls(Array.isArray(fallsData) ? fallsData : []);
    } catch (err) {
      console.error("[useTelemetryHistory] Failed to load history:", err);
      setError(err.message || "Failed to load telemetry history");
    } finally {
      setLoading(false);
    }
  }, [selectedDeviceId, hours]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    hours,
    setHours,
    loading,
    error,
    vitals,
    environment,
    locations,
    falls,
    refetch: fetchHistory,
  };
}

export default useTelemetryHistory;
