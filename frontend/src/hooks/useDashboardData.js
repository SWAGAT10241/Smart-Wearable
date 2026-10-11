import { useState, useEffect, useCallback, useMemo } from "react";
import { vitalsApi, environmentApi, locationApi, fallsApi } from "../lib/apiClient";
import { useLiveData } from "../context/LiveDataContext";
import { useDevices } from "../context/DeviceContext";
import {
  getHeartRateStatus,
  getSpo2Status,
  getTemperatureStatus,
} from "../utils/metrics";

/**
 * Custom hook providing structured state and queries for the primary dashboard.
 */
export function useDashboardData() {
  const { selectedDeviceId, devices, loading: devicesLoading } = useDevices();
  const live = useLiveData();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [environmentHistory, setEnvironmentHistory] = useState([]);
  const [locationHistory, setLocationHistory] = useState([]);
  const [recentFalls, setRecentFalls] = useState([]);
  const [activeFallEvent, setActiveFallEvent] = useState(null);

  // Poll fallback / initial load
  const loadDashboardData = useCallback(async () => {
    if (!selectedDeviceId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [vitalsRes, envRes, locRes, fallsRes, latestFallRes] = await Promise.all([
        vitalsApi.history(selectedDeviceId, 1).catch(() => []),
        environmentApi.history(selectedDeviceId, 1).catch(() => []),
        locationApi.history(selectedDeviceId, 24).catch(() => []),
        fallsApi.all(selectedDeviceId).catch(() => []),
        fallsApi.latest(selectedDeviceId).catch(() => null),
      ]);

      setVitalsHistory(Array.isArray(vitalsRes) ? vitalsRes : []);
      setEnvironmentHistory(Array.isArray(envRes) ? envRes : []);
      setLocationHistory(Array.isArray(locRes) ? locRes : []);
      setRecentFalls(Array.isArray(fallsRes) ? fallsRes : []);

      if (latestFallRes && latestFallRes.status === "detected") {
        setActiveFallEvent(latestFallRes);
      }
    } catch (err) {
      console.error("[useDashboardData] Failed to load data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    setLoading(true);
    loadDashboardData();
  }, [loadDashboardData]);

  // Keep active fall synced with live data
  useEffect(() => {
    if (live.activeFall) {
      setActiveFallEvent(live.activeFall);
    }
  }, [live.activeFall]);

  // Dismiss active fall event
  const dismissFall = useCallback(async (fallId) => {
    try {
      if (fallId) {
        await fallsApi.updateStatus(fallId, "dismissed");
      }
      setActiveFallEvent(null);
      live.dismissFall();
    } catch (err) {
      console.error("[useDashboardData] Failed to dismiss fall:", err);
    }
  }, [live]);

  // Compute live or latest values
  const latestVitals = useMemo(() => {
    if (live.vitals) return live.vitals;
    return vitalsHistory[vitalsHistory.length - 1] || null;
  }, [live.vitals, vitalsHistory]);

  const latestEnvironment = useMemo(() => {
    if (live.environment) return live.environment;
    return environmentHistory[environmentHistory.length - 1] || null;
  }, [live.environment, environmentHistory]);

  const latestLocation = useMemo(() => {
    if (live.location) return live.location;
    return locationHistory[locationHistory.length - 1] || null;
  }, [live.location, locationHistory]);

  // Computed metric statuses
  const hrStatus = useMemo(
    () => getHeartRateStatus(latestVitals?.heartRate),
    [latestVitals?.heartRate],
  );

  const spo2Status = useMemo(
    () => getSpo2Status(latestVitals?.spo2),
    [latestVitals?.spo2],
  );

  const tempStatus = useMemo(
    () => getTemperatureStatus(latestEnvironment?.temperature),
    [latestEnvironment?.temperature],
  );

  const sparklineData = useMemo(() => {
    return {
      heartRate: vitalsHistory.slice(-20).map((r) => r.heartRate || 0),
      spo2: vitalsHistory.slice(-20).map((r) => r.spo2 || 0),
      temperature: environmentHistory.slice(-20).map((r) => r.temperature || 0),
      humidity: environmentHistory.slice(-20).map((r) => r.humidity || 0),
    };
  }, [vitalsHistory, environmentHistory]);

  return {
    loading: loading || devicesLoading,
    error,
    selectedDeviceId,
    devices,
    latestVitals,
    latestEnvironment,
    latestLocation,
    activeFallEvent,
    recentFalls,
    hrStatus,
    spo2Status,
    tempStatus,
    sparklineData,
    vitalsHistory,
    environmentHistory,
    locationHistory,
    isSocketConnected: live.connected,
    dismissFall,
    refetch: loadDashboardData,
  };
}

export default useDashboardData;
