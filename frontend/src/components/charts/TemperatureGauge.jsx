import React from "react";

/**
 * Multi-colored spectrum thermal gauge for environmental temperature.
 * Features JetBrains Mono typography, 10°C-40°C scale labels, and responsive thermal gradient.
 */
export default function TemperatureGauge({ temperature }) {
  const numericTemperature = Number(temperature);

  const pct = Number.isFinite(numericTemperature)
    ? Math.min(100, Math.max(0, ((numericTemperature - 10) / 30) * 100))
    : 0;

  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-2.5 px-0.5">
      {/* Thermal Gradient Track with Sliding Glow Thumb */}
      <div className="relative h-5 w-full flex items-center">
        <div
          className="absolute left-0 right-0 h-[7px] rounded-full shadow-inner"
          style={{
            background: "var(--thermal-gradient)",
          }}
        />

        {/* Animated Thumb */}
        <span
          className="absolute top-1/2 -translate-y-1/2 h-[18px] w-[18px] rounded-full bg-[var(--surface-card)] transition-all duration-700 shadow-md"
          style={{
            left: `calc(${pct}% - 9px)`,
            border: "2.5px solid var(--status-warning)",
            boxShadow: "0 2px 8px rgba(245,158,11,0.45)",
          }}
        />
      </div>

      {/* JetBrains Mono Tactical Scale Labels */}
      <div className="flex items-center justify-between font-mono text-[9px] font-semibold text-[var(--color-text-muted)]">
        <span className="text-cyan-400/90">10°C Low</span>
        <span className="text-emerald-400/90">25°C Comfort</span>
        <span className="text-amber-400/90">40°C High</span>
      </div>
    </div>
  );
}
