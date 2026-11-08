import { useState, useEffect, useMemo, useCallback } from "react";
import {
  vitalsApi,
  environmentApi,
  locationApi,
  fallsApi,
} from "../lib/apiClient";

export const HISTORY_RANGES = [
  { label: "1h", hours: 1 },
  { label: "6h", hours: 6 },
  { label: "24h", hours: 24 },
];

/**
 * Custom hook to manage historical telemetry loading, range selection,
 * sparkline points derivation, and trail vector calculation.
 *
 * @param {string|null} deviceId - Selected device ID
 * @param {number} [initialRange=24] - Initial range in hours
 */
export function useTelemetryHistory(deviceId, initialRange = 24) {
  const [range, setRange] = useState(initialRange);
  const [vitals, setVitals] = useState([]);
  const [env, setEnv] = useState([]);
  const [trail, setTrail] = useState([]);
  const [falls, setFalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!deviceId) {
      setVitals([]);
      setEnv([]);
      setTrail([]);
      setFalls([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [vitalsResult, envResult, trailResult, fallsResult] =
        await Promise.allSettled([
          vitalsApi.history(deviceId, range),
          environmentApi.history(deviceId, range),
          locationApi.history(deviceId, range),
          fallsApi.all(deviceId),
        ]);

      setVitals(
        vitalsResult.status === "fulfilled" && Array.isArray(vitalsResult.value)
          ? vitalsResult.value
          : [],
      );

      setEnv(
        envResult.status === "fulfilled" && Array.isArray(envResult.value)
          ? envResult.value
          : [],
      );

      setTrail(
        trailResult.status === "fulfilled" && Array.isArray(trailResult.value)
          ? trailResult.value
          : [],
      );

      setFalls(
        fallsResult.status === "fulfilled" && Array.isArray(fallsResult.value)
          ? fallsResult.value
          : [],
      );
    } catch (err) {
      setError(err.message || "Failed to load history data");
    } finally {
      setLoading(false);
    }
  }, [deviceId, range]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Chart point arrays
  const hrPoints = useMemo(
    () => vitals.map((item) => Number(item.heartRate)).filter(Number.isFinite),
    [vitals],
  );

  const spo2Points = useMemo(
    () => vitals.map((item) => Number(item.spo2)).filter(Number.isFinite),
    [vitals],
  );

  const tempPoints = useMemo(
    () => env.map((item) => Number(item.temperature)).filter(Number.isFinite),
    [env],
  );

  const humidityPoints = useMemo(
    () => env.map((item) => Number(item.humidity)).filter(Number.isFinite),
    [env],
  );

  const pressurePoints = useMemo(
    () => env.map((item) => Number(item.pressure)).filter(Number.isFinite),
    [env],
  );

  // SVG trail path string
  const trailPath = useMemo(() => {
    if (trail.length < 2) return null;

    const points = trail
      .filter(
        (point) =>
          Number.isFinite(Number(point.latitude)) &&
          Number.isFinite(Number(point.longitude)),
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (points.length < 2) return null;

    const lats = points.map((p) => Number(p.latitude));
    const lngs = points.map((p) => Number(p.longitude));

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const width = 560;
    const height = 220;
    const padding = 20;

    const normalizeX = (lng) =>
      padding + ((lng - minLng) / (maxLng - minLng || 1)) * (width - padding * 2);
    const normalizeY = (lat) =>
      height - padding - ((lat - minLat) / (maxLat - minLat || 1)) * (height - padding * 2);

    return points
      .map(
        (p, idx) =>
          `${idx ? "L" : "M"} ${normalizeX(Number(p.longitude))} ${normalizeY(Number(p.latitude))}`,
      )
      .join(" ");
  }, [trail]);

  return {
    range,
    setRange,
    vitals,
    env,
    trail,
    falls,
    loading,
    error,
    refreshHistory: fetchHistory,
    hrPoints,
    spo2Points,
    tempPoints,
    humidityPoints,
    pressurePoints,
    trailPath,
  };
}
