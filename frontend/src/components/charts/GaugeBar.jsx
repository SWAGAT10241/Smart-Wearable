import React from "react";

/**
 * Linear horizontal progress gauge for percentages (e.g. SpO2, battery).
 */
export default function GaugeBar({ pct = 0, color }) {
  const value = Math.min(Math.max(Number(pct) || 0, 0), 100);

  return (
    <div className="relative h-[72px] w-full">
      <div
        className="absolute left-0 right-0 top-[32px] h-[7px] rounded-full"
        style={{ background: `${color}25` }}
      />

      <div
        className="absolute left-0 top-[32px] h-[7px] rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />

      <span
        className="absolute top-[26px] h-[18px] w-[18px] rounded-full bg-[var(--color-surface)] transition-all duration-700"
        style={{
          left: `calc(${value}% - 9px)`,
          border: `2px solid ${color}`,
          boxShadow: `0 2px 8px ${color}55`,
        }}
      />
    </div>
  );
}

