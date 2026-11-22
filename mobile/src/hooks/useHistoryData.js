import { useEffect, useState, useCallback, useRef } from "react";
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

  const requestSequence = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestSequence.current;
    if (!selectedDeviceId) {
      setVitals([]);
      setEnvironment([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [vitalsResponse, environmentResponse] = await Promise.all([
        vitalsApi.history(selectedDeviceId, hours),
        environmentApi.history(selectedDeviceId, hours),
      ]);

      if (requestId !== requestSequence.current) return;

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
      if (requestId !== requestSequence.current) return;
      console.log("History fetch error:", err);
      setError(err?.message || "Failed to load telemetry history");
    } finally {
      if (requestId === requestSequence.current) setLoading(false);
    }
  }, [selectedDeviceId, hours]);

  useEffect(() => {
    load();
    return () => {
      requestSequence.current += 1;
    };
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

