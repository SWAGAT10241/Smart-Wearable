import { useEffect, useState } from "react";
import AppLayout from "../components/app/AppLayout";
import { useDevices } from "../context/DeviceContext";

import {
  vitalsApi,
  environmentApi,
  locationApi,
  fallsApi,
} from "../lib/apiClient";

const RANGES = [
  { label: "1h", hours: 1 },
  { label: "6h", hours: 6 },
  { label: "24h", hours: 24 },
];

/* ----------------------------------------------------------
 * Sparkline
 * -------------------------------------------------------- */

function Sparkline({ points, color }) {
  const values = Array.isArray(points)
    ? points.map(Number).filter(Number.isFinite)
    : [];

  if (values.length < 2) {
    return (
      <div className="flex h-[140px] items-center justify-center text-sm text-slate-400">
        Not enough data yet
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  const width = 560;
  const height = 140;
  const padding = 12;

  const range = max - min || 1;

  const pointsString = values
    .map((value, index) => {
      const x = padding + (index / (values.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (value - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
    >
      <path
        d={pointsString}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ----------------------------------------------------------
 * Chart card
 * -------------------------------------------------------- */

function ChartCard({ title, points, color, unit }) {
  const values = Array.isArray(points)
    ? points.map(Number).filter(Number.isFinite)
    : [];

  const latest = values.length > 0 ? values[values.length - 1] : null;
  const minimum = values.length > 0 ? Math.min(...values) : null;
  const maximum = values.length > 0 ? Math.max(...values) : null;

  const average =
    values.length > 0
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : null;

  const formatValue = (value) => {
    if (!Number.isFinite(value)) {
      return "--";
    }

    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
      {/* Header */}

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-400">Historical trend</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold tabular-nums text-slate-900">
            {latest != null ? formatValue(latest) : "--"}
          </div>
          {unit && <div className="text-[11px] text-slate-400">{unit}</div>}
        </div>
      </div>

      {/* Chart */}

      <div className="rounded-2xl bg-slate-50 p-3">
        <Sparkline points={values} color={color} />
      </div>

      {/* Statistics */}

      <div className="mt-4 grid grid-cols-3 border-t border-slate-100 pt-4">
        <div className="pr-3">
          <div className="text-sm font-semibold tabular-nums text-slate-900">
            {minimum != null ? formatValue(minimum) : "--"}
          </div>
          <div className="mt-1 text-[10px] font-medium text-slate-400">MIN</div>
        </div>
        <div className="border-l border-slate-200 px-3">
          <div className="text-sm font-semibold tabular-nums text-slate-900">
            {average != null ? formatValue(average) : "--"}
          </div>
          <div className="mt-1 text-[10px] font-medium text-slate-400">AVG</div>
        </div>
        <div className="border-l border-slate-200 pl-3">
          <div className="text-sm font-semibold tabular-nums text-slate-900">
            {maximum != null ? formatValue(maximum) : "--"}
          </div>
          <div className="mt-1 text-[10px] font-medium text-slate-400">MAX</div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
 * History page
 * -------------------------------------------------------- */

export default function History() {
  const { selectedDeviceId, selectedDevice } = useDevices();
  const deviceId = selectedDeviceId;
  const [range, setRange] = useState(24);
  const [vitals, setVitals] = useState([]);
  const [env, setEnv] = useState([]);
  const [trail, setTrail] = useState([]);
  const [falls, setFalls] = useState([]);
  const [loading, setLoading] = useState(false);

  /* --------------------------------------------------------
   * Load history
   * ------------------------------------------------------ */

  useEffect(() => {
    if (!deviceId) {
      setVitals([]);
      setEnv([]);
      setTrail([]);
      setFalls([]);
      return;
    }

    let cancelled = false;
    const loadHistory = async () => {
      setLoading(true);
      const [vitalsResult, envResult, trailResult, fallsResult] =
        await Promise.allSettled([
          vitalsApi.history(deviceId, range),
          environmentApi.history(deviceId, range),
          locationApi.history(deviceId, range),
          fallsApi.all(deviceId),
        ]);
      if (cancelled) {
        return;
      }
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
      setLoading(false);
    };
    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [deviceId, range]);

  /* --------------------------------------------------------
   * Chart data
   * ------------------------------------------------------ */

  const hrPoints = vitals
    .map((item) => Number(item.heartRate))
    .filter(Number.isFinite);
  const spo2Points = vitals
    .map((item) => Number(item.spo2))
    .filter(Number.isFinite);
  const tempPoints = env
    .map((item) => Number(item.temperature))
    .filter(Number.isFinite);
  const humidityPoints = env
    .map((item) => Number(item.humidity))
    .filter(Number.isFinite);
  const pressurePoints = env
    .map((item) => Number(item.pressure))
    .filter(Number.isFinite);
  /* --------------------------------------------------------
   * Trail path
   * ------------------------------------------------------ */

  const trailPath = (() => {
    if (trail.length < 2) {
      return null;
    }
    const points = trail
      .filter(
        (point) =>
          Number.isFinite(Number(point.latitude)) &&
          Number.isFinite(Number(point.longitude)),
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    if (points.length < 2) {
      return null;
    }
    const lats = points.map((point) => Number(point.latitude));
    const lngs = points.map((point) => Number(point.longitude));
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const width = 560;
    const height = 220;
    const padding = 20;
    const normalizeX = (lng) =>
      padding +
      ((lng - minLng) / (maxLng - minLng || 1)) * (width - padding * 2);
    const normalizeY = (lat) =>
      height -
      padding -
      ((lat - minLat) / (maxLat - minLat || 1)) * (height - padding * 2);
    return points
      .map(
        (point, index) =>
          `${index ? "L" : "M"} ${normalizeX(
            Number(point.longitude),
          )} ${normalizeY(Number(point.latitude))}`,
      )
      .join(" ");
  })();

  /* --------------------------------------------------------
   * Render
   * ------------------------------------------------------ */

  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        {/* --------------------------------------------------
         * Header
         * ------------------------------------------------ */}

        <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">
              History & Trends
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {selectedDevice
                ? `${selectedDevice.name || "TrailGuard Wearable"} · ${
                    selectedDevice.deviceId
                  }`
                : "No device selected"}
            </p>
          </div>
          {/* Range selector */}
          <div className="flex gap-2">
            {RANGES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setRange(item.hours)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  range === item.hours
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {/* --------------------------------------------------
         * Loading
         * ------------------------------------------------ */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-[var(--shadow-card)]">
            Loading history...
          </div>
        )}
        {/* --------------------------------------------------
         * Charts
         * ------------------------------------------------ */}
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard
            title="Heart Rate"
            points={hrPoints}
            color="#FF6B85"
            unit="bpm"
          />
          <ChartCard
            title="Blood Oxygen"
            points={spo2Points}
            color="#1976D2"
            unit="% SpO₂"
          />
          <ChartCard
            title="Temperature"
            points={tempPoints}
            color="#F2A93B"
            unit="°C"
          />
          <ChartCard
            title="Humidity"
            points={humidityPoints}
            color="#18BFC1"
            unit="%"
          />
          <ChartCard
            title="Pressure"
            points={pressurePoints}
            color="#8B5CF6"
            unit="hPa"
          />
        </div>
        {/* --------------------------------------------------
         * Trail
         * ------------------------------------------------ */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-slate-900">
              Trail Path
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              GPS movement during the selected period
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            {trailPath ? (
              <svg
                viewBox="0 0 560 220"
                width="100%"
                height="220"
                preserveAspectRatio="none"
              >
                <path
                  d={trailPath}
                  fill="none"
                  stroke="#0E9C8C"
                  strokeWidth="2.5"
                  strokeDasharray="7 5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">
                No location history for this range
              </div>
            )}
          </div>
        </div>
        {/* --------------------------------------------------
         * Fall events
         * ------------------------------------------------ */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Fall Event Log
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Detected fall events for this device
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            {/* Table header */}
            <div className="hidden grid-cols-[1.2fr_0.7fr_1fr_1fr] gap-3 rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-700 md:grid">
              <span>Time</span>
              <span>Severity</span>
              <span>Status</span>
              <span>Location</span>
            </div>
            {/* Empty */}
            {falls.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-slate-500">
                No fall events recorded.
              </div>
            )}
            {/* Events */}
            {falls.map((fall) => (
              <div
                key={fall._id}
                className="
                  grid
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  py-3
                  md:grid-cols-[1.2fr_0.7fr_1fr_1fr]
                  md:gap-3
                "
              >
                <span>
                  {new Date(fall.timestamp).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <span className="capitalize">{fall.severity || "--"}</span>
                <span className="capitalize">
                  {fall.status ? fall.status.replace(/_/g, " ") : "--"}
                </span>
                <span>
                  {Number.isFinite(Number(fall.latitude))
                    ? Number(fall.latitude).toFixed(5)
                    : "--"}
                  ,{" "}
                  {Number.isFinite(Number(fall.longitude))
                    ? Number(fall.longitude).toFixed(5)
                    : "--"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
