import { Heart, Wind, Thermometer, Droplets } from "lucide-react";
import { ChartCard } from "../charts/ChartCard";

export function QuickStatsGrid({
  vitals,
  environment,
  hrStatus,
  spo2Status,
  tempStatus,
  sparklines = {},
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Heart Rate */}
      <ChartCard
        title="Heart Rate"
        value={vitals?.heartRate}
        unit="BPM"
        color="#ef4444"
        icon={Heart}
        trend="Normal range 60-100"
        data={sparklines.heartRate || []}
        badgeText={hrStatus?.status}
        badgeClass={hrStatus?.badgeClass}
      />

      {/* SpO2 */}
      <ChartCard
        title="Blood Oxygen"
        value={vitals?.spo2}
        unit="%"
        color="#06b6d4"
        icon={Wind}
        trend="Normal range 95-100%"
        data={sparklines.spo2 || []}
        badgeText={spo2Status?.status}
        badgeClass={spo2Status?.badgeClass}
      />

      {/* Temperature */}
      <ChartCard
        title="Temperature"
        value={environment?.temperature != null ? Number(environment.temperature).toFixed(1) : null}
        unit="°C"
        color="#f59e0b"
        icon={Thermometer}
        trend="Ambient sensor"
        data={sparklines.temperature || []}
        badgeText={tempStatus?.status}
        badgeClass={tempStatus?.badgeClass}
      />

      {/* Humidity */}
      <ChartCard
        title="Humidity"
        value={environment?.humidity != null ? Number(environment.humidity).toFixed(1) : null}
        unit="%"
        color="#3b82f6"
        icon={Droplets}
        trend={environment?.pressure ? `${Math.round(environment.pressure)} hPa` : "Standard atmospheric"}
        data={sparklines.humidity || []}
        badgeText={environment?.humidity ? "Monitored" : "Offline"}
        badgeClass={environment?.humidity ? "badge-slate" : "badge-slate"}
      />
    </div>
  );
}

export default QuickStatsGrid;
