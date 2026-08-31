import { useEffect, useMemo, useState } from "react";

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
  PressureIcon,
} from "../components/icons";

import { useAuth } from "../context/AuthContext";
import { useDevices } from "../context/DeviceContext";
import { useLiveData } from "../context/LiveDataContext";

import {
  vitalsApi,
  environmentApi,
  locationApi,
  fallsApi,
} from "../lib/apiClient";

/*
 * ==========================================================
 * HELPERS
 * ==========================================================
 */

/*
 * Calculate distance between two GPS coordinates.
 *
 * Returns kilometers.
 */
function distanceBetweenPoints(a, b) {
  const R = 6371;

  const lat1 = Number(a?.latitude);
  const lat2 = Number(b?.latitude);
  const lon1 = Number(a?.longitude);
  const lon2 = Number(b?.longitude);

  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lon1) ||
    !Number.isFinite(lon2)
  ) {
    return 0;
  }

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/*
 * Convert milliseconds to HH:MM:SS.
 */
function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

/*
 * ==========================================================
 * NUMERIC STATISTICS
 * ==========================================================
 */

function calculateNumericStats(values) {
  const numbers = values.map((value) => Number(value)).filter(Number.isFinite);

  if (numbers.length === 0) {
    return {
      min: null,
      average: null,
      max: null,
    };
  }

  return {
    min: Math.min(...numbers),

    average: numbers.reduce((sum, value) => sum + value, 0) / numbers.length,

    max: Math.max(...numbers),
  };
}

/*
 * ==========================================================
 * READING TIMESTAMP
 * ==========================================================
 */

function getReadingTimestamp(reading, fallback) {
  const timestamp =
    reading?.timestamp ||
    reading?.createdAt ||
    reading?.recordedAt ||
    reading?._receivedAt ||
    fallback;

  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? null : date;
}

/*
 * ==========================================================
 * HUMAN-READABLE UPDATED TEXT
 * ==========================================================
 */

function formatUpdatedText(timestamp) {
  const date =
    timestamp instanceof Date ? timestamp : getReadingTimestamp(timestamp);

  if (!date) {
    return "Waiting for data";
  }

  const difference = Math.max(0, Date.now() - date.getTime());

  const seconds = Math.floor(difference / 1000);

  const minutes = Math.floor(seconds / 60);

  const hours = Math.floor(minutes / 60);

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds} sec ago`;
  }

  if (minutes === 1) {
    return "1 min ago";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours === 1) {
    return "1 hour ago";
  }

  return `${hours} hours ago`;
}

/*
 * ==========================================================
 * CALORIE ESTIMATION
 * ==========================================================
 *
 * Calories are estimated from:
 *
 * - distance
 * - duration
 * - trail intensity
 * - elevation gain
 *
 * This is NOT a direct calorie measurement from the ESP32.
 */

function calculateCalories(distanceKm, durationMs, elevationGain = 0) {
  if (
    !Number.isFinite(distanceKm) ||
    !Number.isFinite(durationMs) ||
    distanceKm <= 0 ||
    durationMs <= 0
  ) {
    return null;
  }

  const hours = durationMs / (1000 * 60 * 60);

  if (hours <= 0) {
    return null;
  }

  const speed = distanceKm / hours;

  /*
   * Estimated MET for trail activity.
   */
  let met = 5;

  if (speed >= 7) {
    met = 8;
  } else if (speed >= 5) {
    met = 7;
  } else if (speed >= 3) {
    met = 6;
  }

  /*
   * Default reference weight.
   *
   * Replace with the user's actual
   * profile weight when available.
   */
  const weightKg = 70;

  let calories = met * weightKg * hours;

  /*
   * Small elevation contribution.
   */
  if (Number.isFinite(Number(elevationGain)) && Number(elevationGain) > 0) {
    calories += Number(elevationGain) * 0.05;
  }

  return Math.round(calories);
}

/*
 * ==========================================================
 * DASHBOARD
 * ==========================================================
 */

export default function Dashboard() {
  const { user } = useAuth();

  const { selectedDeviceId, selectedDevice } = useDevices();

  const {
    vitals,
    environment,
    location,
    vitalsUpdatedAt,
    environmentUpdatedAt,
    locationUpdatedAt,
  } = useLiveData();

  const deviceId = selectedDeviceId;

  /*
   * --------------------------------------------------------
   * Latest fallback data
   * --------------------------------------------------------
   */

  const [initialVitals, setInitialVitals] = useState(null);

  const [initialEnv, setInitialEnv] = useState(null);

  const [initialLoc, setInitialLoc] = useState(null);

  /*
   * --------------------------------------------------------
   * History
   * --------------------------------------------------------
   */

  const [vitalsHistory, setVitalsHistory] = useState([]);

  const [environmentHistory, setEnvironmentHistory] = useState([]);

  /*
   * --------------------------------------------------------
   * Statistics
   * --------------------------------------------------------
   */

  const [vitalStats, setVitalStats] = useState(null);

  const [environmentStats, setEnvironmentStats] = useState(null);

  /*
   * --------------------------------------------------------
   * Activity / events
   * --------------------------------------------------------
   */

  const [recentFalls, setRecentFalls] = useState([]);

  const [trail, setTrail] = useState([]);

  /*
   * ========================================================
   * LOAD DASHBOARD DATA
   * ========================================================
   */

  useEffect(() => {
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

      return;
    }

    let cancelled = false;

    const loadDashboard = async () => {
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

        /*
         * REAL VITAL HISTORY
         */
        vitalsApi.history(deviceId, 1),

        vitalsApi.stats(deviceId, 1),

        environmentApi.stats(deviceId, 1),

        environmentApi.history(deviceId, 1),
      ]);

      if (cancelled) {
        return;
      }

      /*
       * Latest readings
       */

      setInitialVitals(
        vitalsRes.status === "fulfilled" ? vitalsRes.value : null,
      );

      setInitialEnv(
        environmentRes.status === "fulfilled" ? environmentRes.value : null,
      );

      setInitialLoc(
        locationRes.status === "fulfilled" ? locationRes.value : null,
      );

      /*
       * Vitals history
       */

      if (
        vitalsHistoryRes.status === "fulfilled" &&
        Array.isArray(vitalsHistoryRes.value)
      ) {
        setVitalsHistory(vitalsHistoryRes.value);
      } else {
        setVitalsHistory([]);
      }

      /*
       * Environment history
       */

      if (
        environmentHistoryRes.status === "fulfilled" &&
        Array.isArray(environmentHistoryRes.value)
      ) {
        setEnvironmentHistory(environmentHistoryRes.value);
      } else {
        setEnvironmentHistory([]);
      }

      /*
       * Falls
       */

      if (fallsRes.status === "fulfilled") {
        const falls = Array.isArray(fallsRes.value) ? fallsRes.value : [];

        setRecentFalls(falls.slice(0, 3));
      } else {
        setRecentFalls([]);
      }

      /*
       * Trail
       */

      if (trailRes.status === "fulfilled") {
        const history = Array.isArray(trailRes.value) ? trailRes.value : [];

        setTrail(history);
      } else {
        setTrail([]);
      }

      /*
       * API statistics are kept as
       * fallback data.
       *
       * The cards below calculate
       * their own statistics from
       * real history.
       */

      setVitalStats(
        vitalsStatsRes.status === "fulfilled" ? vitalsStatsRes.value : null,
      );

      setEnvironmentStats(
        environmentStatsRes.status === "fulfilled"
          ? environmentStatsRes.value
          : null,
      );
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  /*
   * ========================================================
   * REFRESH BACKEND HISTORY/STATS
   * ========================================================
   */

  useEffect(() => {
    if (!deviceId) {
      return;
    }

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

        if (cancelled) {
          return;
        }

        if (Array.isArray(vitalsHistoryData)) {
          setVitalsHistory(vitalsHistoryData);
        }

        if (Array.isArray(environmentHistoryData)) {
          setEnvironmentHistory(environmentHistoryData);
        }

        setVitalStats(vitalsStatsData);

        setEnvironmentStats(environmentStatsData);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to refresh dashboard data:", error);
        }
      }
    };

    /*
     * Refresh every 30 seconds.
     */
    const interval = setInterval(loadStats, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [deviceId]);

  /*
   * ========================================================
   * ADD LIVE VITAL READING TO HISTORY
   * ========================================================
   */

  useEffect(() => {
    if (!deviceId || !vitals) {
      return;
    }

    const timestamp =
      vitals.timestamp ||
      vitals.createdAt ||
      vitals.recordedAt ||
      vitalsUpdatedAt ||
      new Date().toISOString();

    setVitalsHistory((previous) => {
      const alreadyExists = previous.some((item) => {
        const itemTimestamp =
          item.timestamp || item.createdAt || item.recordedAt;

        return itemTimestamp === timestamp;
      });

      if (alreadyExists) {
        return previous;
      }

      return [
        ...previous,
        {
          ...vitals,
          timestamp,
        },
      ].slice(-100);
    });
  }, [deviceId, vitals, vitalsUpdatedAt]);

  /*
   * ========================================================
   * ADD LIVE ENVIRONMENT READING
   * ========================================================
   */

  useEffect(() => {
    if (!deviceId || !environment) {
      return;
    }

    const timestamp =
      environment.timestamp ||
      environment.createdAt ||
      environment.recordedAt ||
      environmentUpdatedAt ||
      new Date().toISOString();

    setEnvironmentHistory((previous) => {
      const alreadyExists = previous.some((item) => {
        const itemTimestamp =
          item.timestamp || item.createdAt || item.recordedAt;

        return itemTimestamp === timestamp;
      });

      if (alreadyExists) {
        return previous;
      }

      return [
        ...previous,
        {
          ...environment,
          timestamp,
        },
      ].slice(-100);
    });
  }, [deviceId, environment, environmentUpdatedAt]);

  /*
   * ========================================================
   * LIVE DATA HAS PRIORITY
   * ========================================================
   */

  const hr = vitals || initialVitals;

  const env = environment || initialEnv;

  const loc = location || initialLoc;

  /*
   * ========================================================
   * ACTIVITY
   * ========================================================
   */

  const activity = useMemo(() => {
    if (!Array.isArray(trail) || trail.length < 2) {
      return {
        distance: null,
        duration: null,
        durationMs: 0,
        elevationGain: null,
        distancePoints: [],
        elevationPoints: [],
      };
    }

    const points = trail
      .filter(
        (point) =>
          Number.isFinite(Number(point.latitude)) &&
          Number.isFinite(Number(point.longitude)),
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (points.length < 2) {
      return {
        distance: null,
        duration: null,
        durationMs: 0,
        elevationGain: null,
        distancePoints: [],
        elevationPoints: [],
      };
    }

    let totalDistance = 0;
    let totalElevationGain = 0;

    const distancePoints = [0];

    const elevationPoints = [0];

    for (let i = 1; i < points.length; i++) {
      const previous = points[i - 1];

      const current = points[i];

      const segmentDistance = distanceBetweenPoints(previous, current);

      totalDistance += segmentDistance;

      distancePoints.push(totalDistance);

      const previousAltitude = Number(previous.altitude);

      const currentAltitude = Number(current.altitude);

      if (
        Number.isFinite(previousAltitude) &&
        Number.isFinite(currentAltitude)
      ) {
        const elevationDifference = currentAltitude - previousAltitude;

        if (elevationDifference > 0) {
          totalElevationGain += elevationDifference;
        }
      }

      elevationPoints.push(totalElevationGain);
    }

    const firstTimestamp = new Date(points[0].timestamp);

    const lastTimestamp = new Date(points[points.length - 1].timestamp);

    const durationMs = lastTimestamp - firstTimestamp;

    return {
      distance: totalDistance,

      duration: formatDuration(durationMs),

      durationMs,

      elevationGain: totalElevationGain,

      distancePoints,

      elevationPoints,
    };
  }, [trail]);

  /*
   * ========================================================
   * CALORIES
   * ========================================================
   */

  const calories = useMemo(
    () =>
      calculateCalories(
        activity.distance,
        activity.durationMs,
        activity.elevationGain,
      ),
    [activity.distance, activity.durationMs, activity.elevationGain],
  );

  /*
   * ========================================================
   * LOCATION
   * ========================================================
   */

  const hasLocation =
    Number.isFinite(Number(loc?.latitude)) &&
    Number.isFinite(Number(loc?.longitude));

  /*
   * ========================================================
   * STATISTICS FROM REAL HISTORY
   * ========================================================
   */

  const heartRateStats = useMemo(
    () => calculateNumericStats(vitalsHistory.map((item) => item.heartRate)),
    [vitalsHistory],
  );

  const spo2Stats = useMemo(
    () => calculateNumericStats(vitalsHistory.map((item) => item.spo2)),
    [vitalsHistory],
  );

  const temperatureStats = useMemo(
    () =>
      calculateNumericStats(environmentHistory.map((item) => item.temperature)),
    [environmentHistory],
  );

  const humidityStats = useMemo(
    () =>
      calculateNumericStats(environmentHistory.map((item) => item.humidity)),
    [environmentHistory],
  );

  const pressureStats = useMemo(
    () =>
      calculateNumericStats(environmentHistory.map((item) => item.pressure)),
    [environmentHistory],
  );

  /*
   * ========================================================
   * UPDATED TIMES
   * ========================================================
   */

  const heartRateTimestamp = getReadingTimestamp(hr, vitalsUpdatedAt);

  const environmentTimestamp = getReadingTimestamp(env, environmentUpdatedAt);

  const locationTimestamp = getReadingTimestamp(loc, locationUpdatedAt);

  const vitalsUpdatedText = formatUpdatedText(heartRateTimestamp);

  const environmentUpdatedText = formatUpdatedText(environmentTimestamp);

  const locationUpdatedText = formatUpdatedText(locationTimestamp);

  /*
   * ========================================================
   * NOTIFICATIONS
   * ========================================================
   */

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

  /*
   * ========================================================
   * STAT CARDS
   * ========================================================
   */

  const stats = [
    /*
     * ------------------------------------------------------
     * HEART RATE
     * ------------------------------------------------------
     */

    {
      icon: <HeartIcon color="#FF6B85" />,

      iconType: "heart",

      label: "HEART RATE",

      value: hr?.heartRate ?? "--",

      unit: "bpm",

      status: hr?.heartRate != null ? "Live" : undefined,

      statusColor: "#0E9C8C",

      variant: "ppg",

      /*
       * IMPORTANT:
       *
       * Use actual BPM history.
       *
       * Do NOT use irSamples here.
       */
      signal: vitalsHistory
        .map((item) => item.heartRate)
        .filter((value) => value != null),

      normalRange: "Normal Range: 60 - 100 bpm",

      updatedText: vitalsUpdatedText,

      miniStats: [
        [
          "Resting",
          heartRateStats.min != null
            ? Math.round(heartRateStats.min)
            : (vitalStats?.minHeartRate ?? "--"),
        ],

        [
          "Avg 1h",
          heartRateStats.average != null
            ? Math.round(heartRateStats.average)
            : (vitalStats?.averageHeartRate ?? "--"),
        ],

        [
          "Peak",
          heartRateStats.max != null
            ? Math.round(heartRateStats.max)
            : (vitalStats?.maxHeartRate ?? "--"),
        ],
      ],
    },

    /*
     * ------------------------------------------------------
     * SPO2
     * ------------------------------------------------------
     */

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

      normalRange: "Normal Range: 95% - 100%",

      updatedText: vitalsUpdatedText,

      miniStats: [
        ["Min", spo2Stats.min != null ? `${spo2Stats.min.toFixed(0)}%` : "--"],

        [
          "Avg",
          spo2Stats.average != null ? `${spo2Stats.average.toFixed(1)}%` : "--",
        ],

        ["Max", spo2Stats.max != null ? `${spo2Stats.max.toFixed(0)}%` : "--"],
      ],
    },

    /*
     * ------------------------------------------------------
     * TEMPERATURE
     * ------------------------------------------------------
     */

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

      gaugePct:
        env?.temperature != null
          ? Math.min(
              100,
              Math.max(0, ((Number(env.temperature) - 10) / 30) * 100),
            )
          : 0,

      normalRange: "Comfort Range: 18°C - 26°C",

      updatedText: environmentUpdatedText,

      miniStats: [
        [
          "Low",
          temperatureStats.min != null
            ? `${temperatureStats.min.toFixed(1)}°`
            : environmentStats?.minTemperature != null
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
          temperatureStats.max != null
            ? `${temperatureStats.max.toFixed(1)}°`
            : environmentStats?.maxTemperature != null
              ? `${Number(environmentStats.maxTemperature).toFixed(1)}°`
              : "--",
        ],
      ],
    },

    /*
     * ------------------------------------------------------
     * HUMIDITY
     * ------------------------------------------------------
     */

    {
      icon: <HumidityIcon />,

      iconType: "humidity",

      label: "HUMIDITY",

      value: env?.humidity != null ? Number(env.humidity).toFixed(1) : "--",

      unit: "%",

      status: env?.humidity != null ? "Normal" : undefined,

      statusColor: "#2BAE8A",

      variant: "bars",

      signal: environmentHistory
        .map((item) => item.humidity)
        .filter((value) => value != null),

      normalRange: "Comfort Range: 30% - 60%",

      updatedText: environmentUpdatedText,

      miniStats: [
        [
          "Low",
          humidityStats.min != null ? `${humidityStats.min.toFixed(1)}%` : "--",
        ],

        [
          "Avg",
          humidityStats.average != null
            ? `${humidityStats.average.toFixed(1)}%`
            : "--",
        ],

        [
          "High",
          humidityStats.max != null ? `${humidityStats.max.toFixed(1)}%` : "--",
        ],
      ],
    },

    /*
     * ------------------------------------------------------
     * PRESSURE
     * ------------------------------------------------------
     */

    {
      icon: <PressureIcon />,

      iconType: "pressure",

      label: "PRESSURE",

      value: env?.pressure != null ? Number(env.pressure).toFixed(1) : "--",

      unit: "hPa",

      status: env?.pressure != null ? "Normal" : undefined,

      statusColor: "#8B5CF6",

      variant: "pressure",

      /*
       * REAL PRESSURE HISTORY
       */
      signal: environmentHistory
        .map((item) => item.pressure)
        .filter((value) => value != null),

      normalRange: "Normal Range: 1000 - 1025 hPa",

      updatedText: environmentUpdatedText,

      miniStats: [
        [
          "Low",
          pressureStats.min != null ? pressureStats.min.toFixed(1) : "--",
        ],

        [
          "Avg",
          pressureStats.average != null
            ? pressureStats.average.toFixed(1)
            : "--",
        ],

        [
          "High",
          pressureStats.max != null ? pressureStats.max.toFixed(1) : "--",
        ],
      ],
    },
  ];

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <AppLayout>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* ==================================================
         * HEADER
         * ================================================== */}

        <header className="flex shrink-0 items-center justify-between gap-4 px-1">
          <div className="min-w-0">
            <h1 className="truncate text-[26px] font-bold tracking-[-0.03em] text-slate-900">
              Welcome back, {user?.username || "User"}! 👋
            </h1>

            <p className="mt-0.5 text-[14px] text-slate-500">
              {selectedDevice
                ? `${
                    selectedDevice.name || "TrailGuard Wearable"
                  } · Your trail overview for today.`
                : "No device selected."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <NotificationBell notifications={notifications} />

            <ProfileMenu />
          </div>
        </header>

        {/* ==================================================
         * VITALS
         * ================================================== */}

        <section className="grid shrink-0 gap-4 xl:grid-cols-5">
          {stats.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </section>

        {/* ==================================================
         * LOCATION + EVENTS
         * ================================================== */}

        <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.45fr_minmax(300px,0.8fr)]">
          {/* ------------------------------------------------
           * LIVE LOCATION
           * ---------------------------------------------- */}

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

                {hasLocation ? locationUpdatedText : "Waiting for signal..."}
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
                ? `${Number(loc.latitude).toFixed(5)}, ${Number(
                    loc.longitude,
                  ).toFixed(5)}`
                : "--, --"}
            </div>
          </section>

          {/* ------------------------------------------------
           * RECENT EVENTS
           * ---------------------------------------------- */}

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

        {/* ==================================================
         * ACTIVITY SUMMARY
         * ================================================== */}

        <section className="shrink-0">
          <ActivitySummary
            distance={activity.distance}
            duration={activity.duration}
            elevationGain={activity.elevationGain}
            /*
             * NOW DYNAMIC
             */
            calories={calories}
            distancePoints={activity.distancePoints}
            elevationPoints={activity.elevationPoints}
          />
        </section>
      </div>
    </AppLayout>
  );
}
