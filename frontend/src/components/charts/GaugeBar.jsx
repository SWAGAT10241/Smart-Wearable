import React from "react";

/**
 * High-precision segmented telemetry gauge for blood oxygen (SpO2).
 * Features illuminated micro-segments, scale calibration ticks, and dynamic glow.
 */
export default function GaugeBar({ pct = 0, color = "#16B890" }) {
  const value = Math.min(Math.max(Number(pct) || 0, 0), 100);
  const totalSegments = 24;
  const activeSegments = Math.round((value / 100) * totalSegments);

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-1 px-1">
      {/* Upper Scale Markers */}
      <div className="flex items-center justify-between text-[9px] font-mono font-semibold text-[var(--color-text-muted)]">
        <span>0%</span>
        <span>90%</span>
        <span className="text-[var(--status-optimal)] font-bold">95% (Opt)</span>
        <span>100%</span>
      </div>

      {/* Precision Segmented Bar Array */}
      <div className="relative my-auto flex h-[22px] items-center gap-[3px] rounded-xl bg-black/20 p-1.5 border border-white/[0.05] shadow-inner">
        {Array.from({ length: totalSegments }).map((_, i) => {
          const isActive = i < activeSegments;
          const isOptimalZone = i >= Math.floor(totalSegments * 0.95);
          const isWarningZone = i < Math.floor(totalSegments * 0.9);

          let segColor = color;
          if (isActive) {
            if (isOptimalZone) segColor = "var(--status-optimal)";
            else if (isWarningZone) segColor = "var(--status-warning)";
          }

          return (
            <div
              key={i}
              className={`h-full flex-1 rounded-[2px] transition-all duration-300 ${
                isActive
                  ? "opacity-100 shadow-[0_0_6px_currentColor]"
                  : "bg-white/[0.06] opacity-30"
              }`}
              style={{
                backgroundColor: isActive ? segColor : undefined,
                color: segColor,
              }}
            />
          );
        })}
      </div>

      {/* Target Comfort Zone Guide Bar */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-optimal)] animate-pulse" />
          <span className="text-[9px] font-medium text-[var(--color-text-secondary)]">
            Optimal: 95%–100%
          </span>
        </div>

        <span className="text-[10px] font-mono font-extrabold tabular-nums" style={{ color }}>
          {value > 0 ? `${value.toFixed(0)}%` : "--"}
        </span>
      </div>
    </div>
  );
}
