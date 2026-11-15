import React from "react";

/**
 * Linear horizontal progress gauge for percentages (e.g. SpO2, battery).
 */
export default function GaugeBar({ pct = 0, color }) {
  const value = Math.min(Math.max(Number(pct) || 0, 0), 100);

  return (
    <div className="relative h-[var(--dash-gauge-track-wrapper-height)] w-full">
      <div
        className="absolute left-0 right-0 top-[var(--dash-gauge-track-top)] h-[var(--dash-gauge-track-thickness)] rounded-full"
        style={{ background: `${color}25` }}
      />

      <div
        className="absolute left-0 top-[var(--dash-gauge-track-top)] h-[var(--dash-gauge-track-thickness)] rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />

      <span
        className="absolute top-[var(--dash-gauge-thumb-top)] h-[var(--dash-gauge-thumb-size)] w-[var(--dash-gauge-thumb-size)] rounded-full bg-[var(--color-surface)] transition-all duration-700"
        style={{
          left: `calc(${value}% - 9px)`,
          border: `2px solid ${color}`,
          boxShadow: `0 2px 8px ${color}55`,
        }}
      />
    </div>
  );
}

