import { useEffect, useState } from "react";

import AppLayout from "../components/app/AppLayout";
import StatCard from "../components/StatCard";
import ActivitySummary from "../components/ActivitySummary";
import NotificationBell from "../components/app/NotificationBell";
import ProfileMenu from "../components/app/ProfileMenu";
import LiveMap from "../components/LiveMap";

import {
  HeartIcon,
  DropletIcon,
  ThermometerIcon,
  HumidityIcon,
} from "../components/icons";

import { useAuth } from "../context/AuthContext";
import { useLiveData } from "../context/LiveDataContext";

import {
  vitalsApi,
  environmentApi,
  locationApi,
  fallsApi,
} from "../lib/apiClient";

export default function Dashboard() {
  const { user } = useAuth();
  const { vitals, environment, location } = useLiveData();

  const deviceId = user?.deviceId;

  const [initialVitals, setInitialVitals] = useState(null);
  const [initialEnv, setInitialEnv] = useState(null);
  const [initialLoc, setInitialLoc] = useState(null);

  const [vitalStats, setVitalStats] = useState(null);
  const [environmentStats, setEnvironmentStats] = useState(null);

  const [recentFalls, setRecentFalls] = useState([]);
  const [trail, setTrail] = useState([]);

  // Load dashboard data.
  useEffect(() => {
    if (!deviceId) return;

    let cancelled = false;

    const loadDashboard = async () => {
      const [
        vitalsRes,
        environmentRes,
        locationRes,
        fallsRes,
        trailRes,
        vitalsStatsRes,
        environmentStatsRes,
      ] = await Promise.allSettled([
        vitalsApi.latest(deviceId),
        environmentApi.latest(deviceId),
        locationApi.latest(deviceId),
        fallsApi.all(deviceId),
        locationApi.history(deviceId, 24),
        vitalsApi.stats(deviceId, 1),
        environmentApi.stats(deviceId, 1),
      ]);

      if (cancelled) return;

      if (vitalsRes.status === "fulfilled") {
        setInitialVitals(vitalsRes.value);
      }

      if (environmentRes.status === "fulfilled") {
        setInitialEnv(environmentRes.value);
      }

      if (locationRes.status === "fulfilled") {
        setInitialLoc(locationRes.value);
      }

      if (fallsRes.status === "fulfilled") {
        const falls = Array.isArray(fallsRes.value) ? fallsRes.value : [];

        setRecentFalls(falls.slice(0, 3));
      }

      if (trailRes.status === "fulfilled") {
        const history = Array.isArray(trailRes.value) ? trailRes.value : [];

        setTrail(history);
      }

      if (vitalsStatsRes.status === "fulfilled") {
        setVitalStats(vitalsStatsRes.value);
      }

      if (environmentStatsRes.status === "fulfilled") {
        setEnvironmentStats(environmentStatsRes.value);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  // Refresh historical statistics every 30 seconds.
  useEffect(() => {
    if (!deviceId) return;

    let cancelled = false;

    const loadStats = async () => {
      try {
        const [vitalsStats, environmentStats] = await Promise.all([
          vitalsApi.stats(deviceId, 1),
          environmentApi.stats(deviceId, 1),
        ]);

        if (cancelled) return;

        setVitalStats(vitalsStats);
        setEnvironmentStats(environmentStats);
      } catch (error) {
        console.error("Failed to refresh dashboard statistics:", error);
      }
    };

    const interval = setInterval(loadStats, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [deviceId]);

  // Live WebSocket data takes priority over initial REST data.
  const hr = vitals || initialVitals;
  const env = environment || initialEnv;
  const loc = location || initialLoc;

  const hasLocation =
    Number.isFinite(loc?.latitude) && Number.isFinite(loc?.longitude);

  const notifications = recentFalls.map((fall) => ({
    id: fall._id,
    title: `${fall.severity} fall detected`,
    message: "TrailGuard detected a possible fall event.",
    time: new Date(fall.timestamp).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  }));

  const stats = [
    {
      icon: <HeartIcon color="#FF6B85" />,
      iconType: "heart",
      label: "HEART RATE",
      value: hr?.heartRate ?? "--",
      unit: "bpm",
      status: hr?.heartRate != null ? "Live" : undefined,
      statusColor: "#0E9C8C",
      variant: "ppg",
      signal: hr?.irSamples ?? [],
      miniStats: [
        ["Resting", vitalStats?.minHeartRate ?? "--"],
        ["Avg 1h", vitalStats?.averageHeartRate ?? "--"],
        ["Peak", vitalStats?.maxHeartRate ?? "--"],
      ],
    },

    {
      icon: <DropletIcon />,
      iconType: "oxygen",
      label: "BLOOD OXYGEN",
      value: hr?.spo2 ?? "--",
      unit: "% SpO₂",
      status: hr?.spo2 != null ? "Normal" : undefined,
      statusColor: "#2BAE8A",
      variant: "gauge",
      gaugePct: hr?.spo2 ?? 0,
      miniStats: [
        ["Min", vitalStats?.minSpo2 != null ? `${vitalStats.minSpo2}%` : "--"],
        [
          "Avg",
          vitalStats?.averageSpo2 != null ? `${vitalStats.averageSpo2}%` : "--",
        ],
        ["Max", vitalStats?.maxSpo2 != null ? `${vitalStats.maxSpo2}%` : "--"],
      ],
    },

    {
      icon: <ThermometerIcon />,
      iconType: "temperature",
      label: "TEMPERATURE",
      value:
        env?.temperature != null ? Number(env.temperature).toFixed(1) : "--",
      unit: "°C",
      status: env?.temperature != null ? "Mild" : undefined,
      statusColor: "#102A43",
      variant: "tempGauge",
      gaugePct: env?.temperature ?? 0,
      miniStats: [
        [
          "Low",
          environmentStats?.minTemperature != null
            ? `${Number(environmentStats.minTemperature).toFixed(1)}°`
            : "--",
        ],
        [
          "Now",
          env?.temperature != null
            ? `${Number(env.temperature).toFixed(1)}°`
            : "--",
        ],
        [
          "High",
          environmentStats?.maxTemperature != null
            ? `${Number(environmentStats.maxTemperature).toFixed(1)}°`
            : "--",
        ],
      ],
    },

    {
      icon: <HumidityIcon />,
      iconType: "humidity",
      label: "HUMIDITY",
      value: env?.humidity != null ? Number(env.humidity).toFixed(1) : "--",
      unit: "%",
      status: env?.humidity != null ? "Normal" : undefined,
      statusColor: "#2BAE8A",
      miniStats: [
        [
          "Low",
          environmentStats?.minHumidity != null
            ? `${Number(environmentStats.minHumidity).toFixed(1)}%`
            : "--",
        ],
        [
          "Avg",
          environmentStats?.averageHumidity != null
            ? `${Number(environmentStats.averageHumidity).toFixed(1)}%`
            : "--",
        ],
        [
          "High",
          environmentStats?.maxHumidity != null
            ? `${Number(environmentStats.maxHumidity).toFixed(1)}%`
            : "--",
        ],
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between gap-4 px-1">
          <div className="min-w-0">
            <h1 className="truncate text-[26px] font-bold tracking-[-0.03em] text-slate-900">
              Welcome back, {user?.username || "User"}! 👋
            </h1>

            <p className="mt-0.5 text-[14px] text-slate-500">
              Here's your trail overview for today.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <NotificationBell notifications={notifications} />
            <ProfileMenu />
          </div>
        </header>

        {/* Vitals */}
        <section className="grid shrink-0 gap-3 xl:grid-cols-4">
          {stats.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </section>

        {/* Location + Events */}
        <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.45fr_minmax(300px,0.8fr)]">
          {/* Live Location */}
          <section className="flex min-h-0 flex-col rounded-[22px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-slate-900">
                Live Location
              </h2>

              <span className="flex items-center gap-2 text-xs text-slate-500">
                <span
                  className={`h-2 w-2 rounded-full ${
                    hasLocation ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />

                {hasLocation ? "Updated live" : "Waiting for signal..."}
              </span>
            </div>

            <div className="min-h-[220px] flex-1 overflow-hidden rounded-[16px] border border-slate-200 bg-slate-100">
              <LiveMap
                latitude={loc?.latitude}
                longitude={loc?.longitude}
                trail={trail}
              />
            </div>

            <div className="mt-2 shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600">
              {hasLocation
                ? `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`
                : "--, --"}
            </div>
          </section>

          {/* Recent Events */}
          <section className="flex min-h-0 flex-col rounded-[22px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-slate-900">
                Recent Events
              </h2>

              <button
                type="button"
                className="text-xs font-medium text-teal-600 transition hover:text-teal-700"
              >
                View all
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {recentFalls.length === 0 ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    ✓
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      No fall events today
                    </div>

                    <div className="mt-0.5 text-xs text-emerald-600">
                      All clear
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentFalls.map((fall) => (
                    <div
                      key={fall._id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            {new Date(fall.timestamp).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )}
                          </div>

                          <div className="mt-1 text-xs capitalize text-slate-500">
                            {fall.severity} fall
                          </div>
                        </div>

                        <span className="rounded-full bg-slate-200 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-slate-600">
                          {fall.status?.replace(/_/g, " ") || "UNKNOWN"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>

        {/* Activity Summary */}
        <section className="shrink-0">
          <ActivitySummary />
        </section>
      </div>
    </AppLayout>
  );
}
