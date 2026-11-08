import { useEffect, useMemo, useState, useCallback } from "react";
import {
  vitalsApi,
  environmentApi,
  locationApi,
  fallsApi,
} from "../lib/apiClient";
import { useLiveData } from "../context/LiveDataContext";
import {
  distanceBetweenPoints,
  calculateNumericStats,
  calculateCalories,
} from "../utils/metrics";
import {
  formatDuration,
  getReadingTimestamp,
  formatUpdatedText,
} from "../utils/formatters";

/**
 * Custom hook encapsulating all telemetry data fetching, history buffering,
 * live WebSocket updates merging, and metric derivation for the Dashboard.
 *
 * @param {string|null} deviceId - Currently selected device ID
 */
export function useDashboardData(deviceId) {
  const {
    vitals,
    environment,
    location,
    vitalsUpdatedAt,
    environmentUpdatedAt,
    locationUpdatedAt,
  } = useLiveData();

  const [initialVitals, setInitialVitals] = useState(null);
  const [initialEnv, setInitialEnv] = useState(null);
  const [initialLoc, setInitialLoc] = useState(null);

  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [environmentHistory, setEnvironmentHistory] = useState([]);

  const [vitalStats, setVitalStats] = useState(null);
  const [environmentStats, setEnvironmentStats] = useState(null);

  const [recentFalls, setRecentFalls] = useState([]);
  const [trail, setTrail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data for selected device
  const loadDashboard = useCallback(async () => {
    if (!deviceId) {
      setInitialVitals(null);
      setInitialEnv(null);
      setInitialLoc(null);
      setVitalsHistory([]);
      setEnvironmentHistory([]);
      setVitalStats(null);
      setEnvironmentStats(null);
      setRecentFalls([]);
      setTrail([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        vitalsRes,
        environmentRes,
        locationRes,
        fallsRes,
        trailRes,
        vitalsHistoryRes,
        vitalsStatsRes,
        environmentStatsRes,
        environmentHistoryRes,
      ] = await Promise.allSettled([
        vitalsApi.latest(deviceId),
        environmentApi.latest(deviceId),
        locationApi.latest(deviceId),
        fallsApi.all(deviceId),
        locationApi.history(deviceId, 24),
        vitalsApi.history(deviceId, 1),
        vitalsApi.stats(deviceId, 1),
        environmentApi.stats(deviceId, 1),
        environmentApi.history(deviceId, 1),
      ]);

      setInitialVitals(vitalsRes.status === "fulfilled" ? vitalsRes.value : null);
      setInitialEnv(environmentRes.status === "fulfilled" ? environmentRes.value : null);
      setInitialLoc(locationRes.status === "fulfilled" ? locationRes.value : null);

      setVitalsHistory(
        vitalsHistoryRes.status === "fulfilled" && Array.isArray(vitalsHistoryRes.value)
          ? vitalsHistoryRes.value
          : [],
      );

      setEnvironmentHistory(
        environmentHistoryRes.status === "fulfilled" &&
          Array.isArray(environmentHistoryRes.value)
          ? environmentHistoryRes.value
          : [],
      );

      if (fallsRes.status === "fulfilled" && Array.isArray(fallsRes.value)) {
        setRecentFalls(fallsRes.value.slice(0, 3));
      } else {
        setRecentFalls([]);
      }

      if (trailRes.status === "fulfilled" && Array.isArray(trailRes.value)) {
        setTrail(trailRes.value);
      } else {
        setTrail([]);
      }

      setVitalStats(vitalsStatsRes.status === "fulfilled" ? vitalsStatsRes.value : null);
      setEnvironmentStats(
        environmentStatsRes.status === "fulfilled" ? environmentStatsRes.value : null,
      );
    } catch (err) {
      setError(err.message || "Failed to load telemetry data");
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Periodic polling for statistics and historical trends every 30s
  useEffect(() => {
    if (!deviceId) return;

    let cancelled = false;

    const loadStats = async () => {
      try {
        const [
          vitalsHistoryData,
          environmentHistoryData,
          vitalsStatsData,
          environmentStatsData,
        ] = await Promise.all([
          vitalsApi.history(deviceId, 1),
          environmentApi.history(deviceId, 1),
          vitalsApi.stats(deviceId, 1),
          environmentApi.stats(deviceId, 1),
        ]);

        if (cancelled) return;

        if (Array.isArray(vitalsHistoryData)) {
          setVitalsHistory(vitalsHistoryData);
        }
        if (Array.isArray(environmentHistoryData)) {
          setEnvironmentHistory(environmentHistoryData);
        }
        setVitalStats(vitalsStatsData);
        setEnvironmentStats(environmentStatsData);
      } catch (pollError) {
        if (!cancelled) {
          console.warn("[Dashboard] Polling refresh error:", pollError);
        }
      }
    };

    const interval = setInterval(loadStats, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [deviceId]);

  // Merge live vitals reading into local history buffer
  useEffect(() => {
    if (!deviceId || !vitals) return;

    const timestamp =
      vitals.timestamp ||
      vitals.createdAt ||
      vitals.recordedAt ||
      vitalsUpdatedAt ||
      new Date().toISOString();

    setVitalsHistory((prev) => {
      const exists = prev.some(
        (item) => (item.timestamp || item.createdAt || item.recordedAt) === timestamp,
      );
      if (exists) return prev;
      return [...prev, { ...vitals, timestamp }].slice(-100);
    });
  }, [deviceId, vitals, vitalsUpdatedAt]);

  // Merge live environment reading into local history buffer
  useEffect(() => {
    if (!deviceId || !environment) return;

    const timestamp =
      environment.timestamp ||
      environment.createdAt ||
      environment.recordedAt ||
      environmentUpdatedAt ||
      new Date().toISOString();

    setEnvironmentHistory((prev) => {
      const exists = prev.some(
        (item) => (item.timestamp || item.createdAt || item.recordedAt) === timestamp,
      );
      if (exists) return prev;
      return [...prev, { ...environment, timestamp }].slice(-100);
    });
  }, [deviceId, environment, environmentUpdatedAt]);

  // Resolve active telemetry values (live stream takes priority over initial fetch)
  const hr = vitals || initialVitals;
  const env = environment || initialEnv;
  const loc = location || initialLoc;

  // Derive trail metrics
  const activity = useMemo(() => {
    if (!Array.isArray(trail) || trail.length < 2) {
      return {
        distance: null,
        duration: null,
        durationMs: 0,
        elevationGain: null,
        distancePoints: [],
        durationPoints: [],
        elevationPoints: [],
        caloriePoints: [],
      };
    }

    const points = trail
      .filter(
        (p) =>
          Number.isFinite(Number(p.latitude)) &&
          Number.isFinite(Number(p.longitude)),
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (points.length < 2) {
      return {
        distance: null,
        duration: null,
        durationMs: 0,
        elevationGain: null,
        distancePoints: [],
        durationPoints: [],
        elevationPoints: [],
        caloriePoints: [],
      };
    }

    let totalDistance = 0;
    let totalElevationGain = 0;

    const distancePoints = [0];
    const durationPoints = [0];
    const elevationPoints = [0];
    const caloriePoints = [0];

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      totalDistance += distanceBetweenPoints(prev, curr);
      distancePoints.push(totalDistance);

      const prevAlt = Number(prev.altitude);
      const currAlt = Number(curr.altitude);

      if (Number.isFinite(prevAlt) && Number.isFinite(currAlt)) {
        const diff = currAlt - prevAlt;
        if (diff > 0) totalElevationGain += diff;
      }
      elevationPoints.push(totalElevationGain);

      const elapsedMs = new Date(curr.timestamp) - new Date(points[0].timestamp);
      durationPoints.push(Math.max(0, elapsedMs));

      caloriePoints.push(
        calculateCalories(totalDistance, Math.max(0, elapsedMs), totalElevationGain) ?? 0,
      );
    }

    const firstTs = new Date(points[0].timestamp);
    const lastTs = new Date(points[points.length - 1].timestamp);
    const durationMs = lastTs - firstTs;

    return {
      distance: totalDistance,
      duration: formatDuration(durationMs),
      durationMs,
      elevationGain: totalElevationGain,
      distancePoints,
      durationPoints,
      elevationPoints,
      caloriePoints,
    };
  }, [trail]);

  const calories = useMemo(
    () =>
      calculateCalories(
        activity.distance,
        activity.durationMs,
        activity.elevationGain,
      ),
    [activity.distance, activity.durationMs, activity.elevationGain],
  );

  const hasLocation =
    Number.isFinite(Number(loc?.latitude)) && Number.isFinite(Number(loc?.longitude));

  const heartRateStats = useMemo(
    () => calculateNumericStats(vitalsHistory.map((item) => item.heartRate)),
    [vitalsHistory],
  );

  const spo2Stats = useMemo(
    () => calculateNumericStats(vitalsHistory.map((item) => item.spo2)),
    [vitalsHistory],
  );

  const temperatureStats = useMemo(
    () => calculateNumericStats(environmentHistory.map((item) => item.temperature)),
    [environmentHistory],
  );

  const humidityStats = useMemo(
    () => calculateNumericStats(environmentHistory.map((item) => item.humidity)),
    [environmentHistory],
  );

  const pressureStats = useMemo(
    () => calculateNumericStats(environmentHistory.map((item) => item.pressure)),
    [environmentHistory],
  );

  const heartRateTimestamp = getReadingTimestamp(hr, vitalsUpdatedAt);
  const environmentTimestamp = getReadingTimestamp(env, environmentUpdatedAt);
  const locationTimestamp = getReadingTimestamp(loc, locationUpdatedAt);
  const locationUpdatedText = hasLocation
    ? formatUpdatedText(locationTimestamp)
    : "Waiting for signal...";

  const notifications = useMemo(
    () =>
      recentFalls.map((fall) => ({
        id: fall._id,
        title: `${fall.severity} fall detected`,
        message: "TrailGuard detected a possible fall event.",
        time: new Date(fall.timestamp).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      })),
    [recentFalls],
  );

  return {
    loading,
    error,
    refreshDashboard: loadDashboard,
    hr,
    env,
    loc,
    hasLocation,
    activity,
    calories,
    recentFalls,
    trail,
    vitalsHistory,
    environmentHistory,
    vitalStats,
    environmentStats,
    heartRateStats,
    spo2Stats,
    temperatureStats,
    humidityStats,
    pressureStats,
    heartRateTimestamp,
    environmentTimestamp,
    locationTimestamp,
    locationUpdatedText,
    notifications,
  };
}
