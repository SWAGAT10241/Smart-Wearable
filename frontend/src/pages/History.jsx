import { useEffect, useState } from "react";
import AppLayout from "../components/app/AppLayout";
import { useAuth } from "../context/AuthContext";
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

function Sparkline({ points, color }) {
  if (!points?.length || points.length < 2) {
    return (
      <div className="flex h-[120px] items-center justify-center text-sm text-slate-500">
        Not enough data yet
      </div>
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points) || 1;
  const norm = (v) => 1 - (v - min) / (max - min || 1);

  const w = 560;
  const h = 120;
  const pad = 10;
  const step = (w - pad * 2) / (points.length - 1);

  const path = points
    .map(
      (p, i) =>
        `${i ? "L" : "M"} ${pad + i * step} ${pad + norm(p) * (h - pad * 2)}`,
    )
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartCard({ title, points, color }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>

      <div className="rounded-2xl bg-slate-50 p-3">
        <Sparkline points={points} color={color} />
      </div>
    </div>
  );
}

export default function History() {
  const { user } = useAuth();
  const deviceId = user?.deviceId;

  const [range, setRange] = useState(24);
  const [vitals, setVitals] = useState([]);
  const [env, setEnv] = useState([]);
  const [trail, setTrail] = useState([]);
  const [falls, setFalls] = useState([]);

  useEffect(() => {
    if (!deviceId) return;

    vitalsApi
      .history(deviceId, range)
      .then(setVitals)
      .catch(() => setVitals([]));

    environmentApi
      .history(deviceId, range)
      .then(setEnv)
      .catch(() => setEnv([]));

    locationApi
      .history(deviceId, range)
      .then(setTrail)
      .catch(() => setTrail([]));

    fallsApi
      .all(deviceId)
      .then(setFalls)
      .catch(() => setFalls([]));
  }, [deviceId, range]);

  const hrPoints = vitals.map((v) => v.heartRate);
  const spo2Points = vitals.map((v) => v.spo2);
  const tempPoints = env.map((e) => e.temperature);
  const humidityPoints = env.map((e) => e.humidity);

  const trailPath = (() => {
    if (trail.length < 2) return null;

    const lats = trail.map((t) => t.latitude);
    const lngs = trail.map((t) => t.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const w = 560;
    const h = 220;
    const pad = 20;

    const nx = (lng) =>
      pad + ((lng - minLng) / (maxLng - minLng || 1)) * (w - pad * 2);

    const ny = (lat) =>
      h - pad - ((lat - minLat) / (maxLat - minLat || 1)) * (h - pad * 2);

    return trail
      .map((t, i) => `${i ? "L" : "M"} ${nx(t.longitude)} ${ny(t.latitude)}`)
      .join(" ");
  })();

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">
          History & Trends
        </h1>

        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.hours)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                range === r.hours
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Heart Rate (bpm)" points={hrPoints} color="#FF6B85" />

        <ChartCard
          title="Blood Oxygen (SpO2 %)"
          points={spo2Points}
          color="var(--color-secondary)"
        />

        <ChartCard
          title="Temperature (°C)"
          points={tempPoints}
          color="var(--color-temp)"
        />

        <ChartCard
          title="Humidity (%)"
          points={humidityPoints}
          color="var(--color-accent)"
        />
      </div>

      {/* Trail */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 text-base font-semibold text-slate-900">
          Trail Path
        </h3>

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
            <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">
              No location history for this range
            </div>
          )}
        </div>
      </div>

      {/* Fall Events */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 text-base font-semibold text-slate-900">
          Fall Event Log
        </h3>

        <div className="grid gap-2 text-sm text-slate-600">
          <div className="grid grid-cols-[1.2fr_0.7fr_1fr_1fr] gap-3 rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-700">
            <span>Time</span>
            <span>Severity</span>
            <span>Status</span>
            <span>Location</span>
          </div>

          {falls.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-slate-500">
              No fall events recorded.
            </div>
          )}

          {falls.map((f) => (
            <div
              key={f._id}
              className="grid grid-cols-[1.2fr_0.7fr_1fr_1fr] gap-3 rounded-xl border border-slate-200 px-3 py-2 text-slate-600"
            >
              <span>
                {new Date(f.timestamp).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>

              <span className="capitalize">{f.severity}</span>

              <span className="capitalize">{f.status.replace(/_/g, " ")}</span>

              <span>
                {f.latitude?.toFixed(2)}, {f.longitude?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
