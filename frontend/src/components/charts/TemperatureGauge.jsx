import React from "react";

/**
 * Minimalist high-density tactical temperature gauge.
 * Supports dual light/dark modes with segmented thermal zone bars, calibration tick marks, and live target pointer.
 */
export default function TemperatureGauge({ temperature }) {
  const numTemp = Number(temperature);
  const isValid = Number.isFinite(numTemp);
  const safeTemp = isValid ? numTemp : 20;

  // Scale: 10°C to 40°C
  const pct = Math.min(100, Math.max(0, ((safeTemp - 10) / 30) * 100));

  const ticks = [
    { label: "10°", pos: 0 },
    { label: "20°", pos: 33.3 },
    { label: "30°", pos: 66.6 },
    { label: "40°", pos: 100 },
  ];

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-1 px-1 font-mono">
      {/* Upper Tactical Scale Ticks */}
      <div className="flex items-center justify-between text-[9px] font-semibold text-[var(--color-text-muted)]">
        {ticks.map((t) => (
          <span key={t.label}>{t.label}</span>
        ))}
      </div>

      {/* High-density thermal spectrum track */}
      <div className="relative my-auto h-[18px] w-full overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-[2px]">
        {/* Thermal gradient ribbon */}
        <div
          className="h-full w-full rounded-[3px] opacity-75 dark:opacity-85"
          style={{
            background:
              "linear-gradient(90deg, #38BDF8 0%, #10B981 33%, #F59E0B 66%, #EF4444 100%)",
          }}
        />

        {/* Tactical Crosshair / Cursor */}
        {isValid && (
          <div
            className="absolute top-0 bottom-0 z-10 w-[3px] -translate-x-1/2 rounded-full bg-[var(--color-text)] shadow-[0_0_8px_rgba(0,0,0,0.6)] transition-all duration-500"
            style={{ left: `${pct}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[var(--color-text)]" />
          </div>
        )}
      </div>

      {/* Lower Tactical Range Status */}
      <div className="flex items-center justify-between text-[9px]">
        <span className="font-semibold text-[var(--color-text-secondary)]">
          {safeTemp < 18 ? "COOL" : safeTemp <= 26 ? "COMFORT" : "WARM"}
        </span>

        <span className="font-bold tabular-nums text-[var(--status-warning)]">
          {isValid ? `${numTemp.toFixed(1)}°C` : "--"}
        </span>
      </div>
    </div>
  );
}
