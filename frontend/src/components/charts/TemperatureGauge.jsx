import React from "react";

/**
 * Multi-colored spectrum thermal gauge for environmental temperature.
 */
export default function TemperatureGauge({ temperature }) {
  const numericTemperature = Number(temperature);

  const pct = Number.isFinite(numericTemperature)
    ? Math.min(100, Math.max(0, ((numericTemperature - 10) / 30) * 100))
    : 0;

  return (
    <div className="relative h-[var(--dash-gauge-track-wrapper-height)] w-full">
      <div
        className="absolute left-0 right-0 top-[var(--dash-gauge-track-top)] h-[var(--dash-gauge-track-thickness)] rounded-full"
        style={{
          background: "var(--thermal-gradient)",
        }}
      />

      <span
        className="absolute top-[var(--dash-gauge-thumb-top)] h-[var(--dash-gauge-thumb-size)] w-[var(--dash-gauge-thumb-size)] rounded-full bg-[var(--surface-card)] transition-all duration-700"
        style={{
          left: `calc(${pct}% - 9px)`,
          border: "2px solid var(--status-warning)",
          boxShadow: "0 2px 6px rgba(245,158,11,0.25)",
        }}
      />
    </div>
  );
}

