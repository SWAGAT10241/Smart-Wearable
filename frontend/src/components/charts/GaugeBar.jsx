import React from "react";

/**
 * Clinical-grade SpO₂ (Blood Oxygen) Segmented Bar.
 * Features 20 precision clinical segments (80% - 100% saturation range),
 * unified reassuring health-tier color palette (no false red alarms at optimal levels),
 * dedicated 95% target threshold guide, distinct resting Standby presentation with glass badge,
 * and high-contrast WCAG 2.2 AA compliant zone legends.
 */
export default function GaugeBar({ pct = 0, color }) {
  const numericVal = Number(pct);
  const isStandby = !Number.isFinite(numericVal) || numericVal <= 0;
  const value = isStandby ? 0 : Math.min(Math.max(numericVal, 0), 100);

  // 20 precision segments mapping 80% to 100% SpO2 (1% step per bar)
  const TOTAL_BARS = 20;
  const MIN_SPO2 = 80;
  const MAX_SPO2 = 100;

  // Determine overall health tier for active reading
  const isOptimal = value >= 95;
  const isWarning = value >= 90 && value < 95;
  const isCritical = value > 0 && value < 90;

  let activeColor = "oklch(0.62 0.19 155)"; // Optimal Emerald
  let activeGlow = "oklch(0.62 0.19 155 / 0.40)";
  let statusBadgeText = "95–100% Optimal";
  let statusBadgeColor = "text-emerald-600 dark:text-emerald-400";

  if (isWarning) {
    activeColor = "oklch(0.68 0.18 58)"; // Warning Amber
    activeGlow = "oklch(0.68 0.18 58 / 0.40)";
    statusBadgeText = "90–94% Warning";
    statusBadgeColor = "text-amber-600 dark:text-amber-400";
  } else if (isCritical) {
    activeColor = "oklch(0.65 0.24 16)"; // Critical Red
    activeGlow = "oklch(0.65 0.24 16 / 0.40)";
    statusBadgeText = "<90% Critical Low";
    statusBadgeColor = "text-rose-600 dark:text-rose-400";
  }

  // Calculate segment state
  // Index 0 = 80%, Index 10 = 90% (start of warning), Index 15 = 95% (target threshold), Index 19 = 100%
  const TARGET_INDEX = 15; // 95% mark

  const getSegmentState = (index) => {
    const barThreshold = MIN_SPO2 + (index / (TOTAL_BARS - 1)) * (MAX_SPO2 - MIN_SPO2);
    const isActive = !isStandby && value >= barThreshold - 0.4;
    const isTarget = index === TARGET_INDEX;
    const isPeakActive = !isStandby && isActive && (index === TOTAL_BARS - 1 || value < barThreshold + 1);

    // Height steps upward subtly from 65% to 100% for sleek dynamic presence
    const heightPercent = 65 + (index / (TOTAL_BARS - 1)) * 35;

    // Segment zone identity
    const isOptimalZone = index >= TARGET_INDEX;
    const isWarningZone = index >= 10 && index < TARGET_INDEX;
    const isCriticalZone = index < 10;

    return {
      isActive,
      isTarget,
      isPeakActive,
      heightPercent,
      isOptimalZone,
      isWarningZone,
      isCriticalZone,
    };
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-1 px-1">
      {/* Standby Watermark Badge (Aligned with Heart Rate, Humidity, and Pressure) */}
      {isStandby && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="rounded-md bg-white/90 dark:bg-black/60 backdrop-blur-md px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border border-black/15 dark:border-white/10 shadow-sm">
            Standby
          </span>
        </div>
      )}

      {/* Segmented Meter Track */}
      <div className="relative flex h-[48px] w-full items-end justify-between gap-[3px] px-0.5">
        {Array.from({ length: TOTAL_BARS }).map((_, index) => {
          const {
            isActive,
            isTarget,
            isPeakActive,
            heightPercent,
            isOptimalZone,
            isWarningZone,
          } = getSegmentState(index);

          return (
            <div
              key={index}
              className="relative flex flex-1 flex-col justify-end h-full group"
            >
              {/* 95% Target Pip Marker */}
              {isTarget && (
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                  title="95% Optimal Threshold Target"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                  <div className="w-[1px] h-1 bg-emerald-500/60" />
                </div>
              )}

              {/* Segment Bar */}
              <div
                className={`w-full rounded-[2px] transition-all duration-300 ease-out ${
                  isActive ? "scale-y-[1.02]" : ""
                }`}
                style={{
                  height: `${heightPercent}%`,
                  background: isActive
                    ? activeColor
                    : isStandby
                      ? isOptimalZone
                        ? "rgba(16, 185, 129, 0.08)"
                        : isWarningZone
                          ? "rgba(245, 158, 11, 0.07)"
                          : "rgba(239, 68, 68, 0.06)"
                      : "rgba(125, 125, 125, 0.12)",
                  border: isActive
                    ? `1px solid ${activeColor}`
                    : isStandby
                      ? isOptimalZone
                        ? "1px solid rgba(16, 185, 129, 0.20)"
                        : isWarningZone
                          ? "1px solid rgba(245, 158, 11, 0.18)"
                          : "1px solid rgba(239, 68, 68, 0.15)"
                      : "1px solid rgba(125, 125, 125, 0.18)",
                  boxShadow: isActive
                    ? isPeakActive
                      ? `0 0 10px ${activeGlow}, 0 0 4px ${activeColor}`
                      : `0 0 6px ${activeGlow}`
                    : "none",
                  opacity: isActive ? 1 : isStandby ? 0.75 : 0.35,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Clinical Range Guide Bar & Status Readout */}
      <div className="flex items-center justify-between font-mono text-[9px] font-semibold text-[var(--color-text-secondary)] px-0.5 pt-1 border-t border-[var(--border-default)]/60 dark:border-white/[0.06]">
        {/* Low Zone Legend */}
        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          &lt;90% Low
        </span>

        {/* Warning Zone Legend */}
        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          90–94%
        </span>

        {/* Optimal Target Zone Legend / Live Status */}
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
          {isStandby ? "≥95% Optimal" : `${value.toFixed(0)}% • ${statusBadgeText}`}
        </span>
      </div>
    </div>
  );
}
