import React from "react";

/**
 * Linear horizontal progress gauge for percentages (e.g. SpO2, battery).
 * Features JetBrains Mono typography scale labels and smooth progress track.
 */
export default function GaugeBar({ pct = 0, color }) {
  const value = Math.min(Math.max(Number(pct) || 0, 0), 100);

  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-2.5 px-0.5">
      {/* Gauge Track with Thumb Indicator */}
      <div className="relative h-5 w-full flex items-center">
        <div
          className="absolute left-0 right-0 h-[7px] rounded-full shadow-inner"
          style={{ background: `${color}25` }}
        />

        <div
          className="absolute left-0 h-[7px] rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />

        <span
          className="absolute top-1/2 -translate-y-1/2 h-[18px] w-[18px] rounded-full bg-[var(--color-surface)] transition-all duration-700 shadow-md"
          style={{
            left: `calc(${value}% - 9px)`,
            border: `2.5px solid ${color}`,
            boxShadow: `0 2px 8px ${color}55`,
          }}
        />
      </div>

      {/* JetBrains Mono Tactical Scale Labels */}
      <div className="flex items-center justify-between font-mono text-[9px] font-semibold text-[var(--color-text-muted)]">
        <span className="text-rose-400/80">90%</span>
        <span className="text-cyan-400/80">95%</span>
        <span className="text-emerald-400 font-bold">100% SpO₂</span>
      </div>
    </div>
  );
}
