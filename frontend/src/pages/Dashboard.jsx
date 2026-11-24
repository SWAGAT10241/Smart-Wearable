import { useMemo } from "react";
import AppLayout from "../components/app/AppLayout";
import ActivitySummary from "../components/ActivitySummary";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import QuickStatsGrid from "../components/dashboard/QuickStatsGrid";
import LiveLocationCard from "../components/dashboard/LiveLocationCard";
import RecentEventsCard from "../components/dashboard/RecentEventsCard";

import {
  HeartIcon,
  DropletIcon,
  ThermometerIcon,
  HumidityIcon,
  PressureIcon,
} from "../components/icons";

import { useAuth } from "../context/AuthContext";
import { useDevices } from "../context/DeviceContext";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const { user } = useAuth();
  const { selectedDeviceId, selectedDevice } = useDevices();

  const {
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
    locationUpdatedText,
    notifications,
    lastSeen,
  } = useDashboardData(selectedDeviceId);

  // Dynamic physiological & environmental status evaluators
  const getHeartRateStatus = (rate) => {
    if (rate == null || rate === "--") return undefined;
    const n = Number(rate);
    if (n > 120) return "Alert";
    if (n > 100) return "High";
    if (n < 50) return "Alert";
    if (n < 60) return "Low";
    return "Live";
  };

  const getOxygenStatus = (spo2) => {
    if (spo2 == null || spo2 === "--") return undefined;
    const n = Number(spo2);
    if (n >= 95) return "Optimal";
    if (n >= 90) return "Warning";
    return "Low";
  };

  const getTemperatureStatus = (temp) => {
    if (temp == null || temp === "--") return undefined;
    const n = Number(temp);
    if (n > 34) return "High";
    if (n > 26) return "Mild";
    if (n < 18) return "Cold";
    return "Normal";
  };

  const getHumidityStatus = (hum) => {
    if (hum == null || hum === "--") return undefined;
    const n = Number(hum);
    if (n > 65) return "Humid";
    if (n < 30) return "Dry";
    return "Normal";
  };

  const getPressureStatus = (pres) => {
    if (pres == null || pres === "--") return undefined;
    const n = Number(pres);
    if (n < 1000) return "Low";
    if (n > 1025) return "High";
    return "Normal";
  };

  // Configuration for 5 quick metric stat cards
  const stats = useMemo(
    () => [
      {
        icon: <HeartIcon color="var(--action-destructive)" />,
        iconType: "heart",
        label: "HEART RATE",
        value: hr?.heartRate ?? "--",
        unit: "bpm",
        status: getHeartRateStatus(hr?.heartRate),
        statusColor: "var(--status-optimal)",
        variant: "ppg",
        signal: vitalsHistory
          .map((item) => item.heartRate)
          .filter((value) => value != null),
        normalRange: "Normal Range: 60 - 100 bpm",
        updatedAt: heartRateTimestamp,
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
      {
        icon: <DropletIcon />,
        iconType: "oxygen",
        label: "BLOOD OXYGEN",
        value: hr?.spo2 ?? "--",
        unit: "% SpO₂",
        status: getOxygenStatus(hr?.spo2),
        statusColor: "var(--status-optimal)",
        variant: "gauge",
        gaugePct: hr?.spo2 ?? 0,
        normalRange: "Normal Range: 95% - 100%",
        updatedAt: heartRateTimestamp,
        miniStats: [
          ["Min", spo2Stats.min != null ? `${spo2Stats.min.toFixed(0)}%` : "--"],
          [
            "Avg",
            spo2Stats.average != null ? `${spo2Stats.average.toFixed(1)}%` : "--",
          ],
          ["Max", spo2Stats.max != null ? `${spo2Stats.max.toFixed(0)}%` : "--"],
        ],
      },
      {
        icon: <ThermometerIcon />,
        iconType: "temperature",
        label: "TEMPERATURE",
        value: env?.temperature != null ? Number(env.temperature).toFixed(1) : "--",
        unit: "°C",
        status: getTemperatureStatus(env?.temperature),
        statusColor: "var(--status-warning)",
        variant: "tempGauge",
        gaugePct:
          env?.temperature != null
            ? Math.min(
                100,
                Math.max(0, ((Number(env.temperature) - 10) / 30) * 100),
              )
            : 0,
        normalRange: "Comfort Range: 18°C - 26°C",
        updatedAt: environmentTimestamp,
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
      {
        icon: <HumidityIcon />,
        iconType: "humidity",
        label: "HUMIDITY",
        value: env?.humidity != null ? Number(env.humidity).toFixed(1) : "--",
        unit: "%",
        status: getHumidityStatus(env?.humidity),
        statusColor: "var(--status-optimal)",
        variant: "bars",
        signal: environmentHistory
          .map((item) => item.humidity)
          .filter((value) => value != null),
        normalRange: "Comfort Range: 30% - 60%",
        updatedAt: environmentTimestamp,
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
      {
        icon: <PressureIcon />,
        iconType: "pressure",
        label: "PRESSURE",
        value: env?.pressure != null ? Number(env.pressure).toFixed(1) : "--",
        unit: "hPa",
        status: getPressureStatus(env?.pressure),
        statusColor: "var(--status-info)",
        variant: "pressure",
        signal: environmentHistory
          .map((item) => item.pressure)
          .filter((value) => value != null),
        normalRange: "Normal Range: 1000 - 1025 hPa",
        updatedAt: environmentTimestamp,
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
    ],
    [
      hr,
      env,
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
    ],
  );

  return (
    <AppLayout>
      <div className="flex min-h-0 flex-1 flex-col gap-[var(--page-section-gap)]">
        {/* Header */}
        <DashboardHeader
          user={user}
          selectedDevice={selectedDevice}
          lastSeen={lastSeen}
          notifications={notifications}
        />

        {/* Quick Vitals & Environment Statistics */}
        <QuickStatsGrid stats={stats} />

        {/* Live Location and Recent Events */}
        <section className="grid min-h-0 flex-1 gap-[var(--page-section-gap)] xl:grid-cols-[1.45fr_minmax(var(--dash-events-col-min-width),0.8fr)]">
          <LiveLocationCard
            loc={loc}
            trail={trail}
            hasLocation={hasLocation}
            locationUpdatedText={locationUpdatedText}
          />

          <RecentEventsCard recentFalls={recentFalls} />
        </section>

        {/* Activity Summary */}
        <section className="shrink-0">
          <ActivitySummary
            distance={activity.distance}
            duration={activity.duration}
            elevationGain={activity.elevationGain}
            calories={calories}
            distancePoints={activity.distancePoints}
            durationPoints={activity.durationPoints}
            elevationPoints={activity.elevationPoints}
            caloriePoints={activity.caloriePoints}
          />
        </section>
      </div>
    </AppLayout>
  );
}
