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
    <div className="relative h-[72px] w-full">
      <div
        className="absolute left-0 right-0 top-[32px] h-[7px] rounded-full"
        style={{
          background:
            "linear-gradient(90deg,#1976D2,#18BFC1,#9DDC67,#F2A93B,#F59E0B)",
        }}
      />

      <span
        className="absolute top-[26px] h-[19px] w-[19px] rounded-full bg-[var(--color-surface)] transition-all duration-700"
        style={{
          left: `calc(${pct}% - 9.5px)`,
          border: "2px solid #F2A93B",
          boxShadow: "0 2px 8px rgba(242,169,59,0.35)",
        }}
      />
    </div>
  );
}

