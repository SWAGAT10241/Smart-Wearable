import { useEffect, useState, useCallback } from "react";
import { vitalsApi, environmentApi } from "../lib/apiClient";
import { useDevices } from "../context/DeviceContext";

/**
 * Custom hook managing historical telemetry data fetching and caching for Mobile.
 *
 * @param {number} [hours=24] - Historical window in hours
 * @returns {object} { vitals, environment, loading, error, refresh }
 */
export function useHistoryData(hours = 24) {
  const { selectedDeviceId } = useDevices();
  const [vitals, setVitals] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!selectedDeviceId) {
      setVitals([]);
      setEnvironment([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [vitalsResponse, environmentResponse] = await Promise.all([
        vitalsApi.history(selectedDeviceId, hours),
        environmentApi.history(selectedDeviceId, hours),
      ]);

      setVitals(
        Array.isArray(vitalsResponse)
          ? vitalsResponse
          : vitalsResponse?.vitals || vitalsResponse?.data || [],
      );

      setEnvironment(
        Array.isArray(environmentResponse)
          ? environmentResponse
          : environmentResponse?.environment || environmentResponse?.data || [],
      );
    } catch (err) {
      console.log("History fetch error:", err);
      setError(err?.message || "Failed to load telemetry history");
    } finally {
      setLoading(false);
    }
  }, [selectedDeviceId, hours]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    vitals,
    environment,
    loading,
    error,
    refresh: load,
  };
}

export default useHistoryData;

