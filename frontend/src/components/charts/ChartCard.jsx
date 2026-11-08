import React from "react";
import Sparkline from "./Sparkline";

/**
 * Minimalist high-density tactical ChartCard for historical telemetry metrics.
 */
export default function ChartCard({
  title,
  points,
  color = "#16B890",
  unit,
  sensorType = "generic",
  normalRange,
}) {
  const values = Array.isArray(points)
    ? points.map(Number).filter(Number.isFinite)
    : [];

  const latest = values.length > 0 ? values[values.length - 1] : null;
  const minimum = values.length > 0 ? Math.min(...values) : null;
  const maximum = values.length > 0 ? Math.max(...values) : null;

  const average =
    values.length > 0
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : null;

  const formatValue = (value) => {
    if (!Number.isFinite(value)) {
      return "--";
    }
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-xs font-mono transition-all duration-200 hover:border-[var(--color-accent)]/50">
      {/* Tactical Top Accent Line */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-70"
        style={{ background: `linear-gradient(90deg, ${color}, transparent 60%)` }}
      />

      {/* Header Deck */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[11px] font-bold uppercase tracking-wider text-[var(--color-text)]">
              {title}
            </h3>
            {normalRange && (
              <span className="shrink-0 rounded px-1.5 py-0.5 text-[8px] font-semibold text-[var(--status-optimal)] border border-[var(--status-optimal)]/30 bg-[var(--status-optimal)]/10">
                {normalRange}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">HISTORICAL TREND</p>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-base font-black tabular-nums text-[var(--color-text)] leading-tight">
            {latest != null ? formatValue(latest) : "--"}
          </div>
          {unit && <div className="text-[9px] text-[var(--color-text-muted)]">{unit}</div>}
        </div>
      </div>

      {/* Recessed Sparkline Viewport */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]/60 p-2 shadow-2xs">
        <Sparkline
          points={values}
          color={color}
          unit={unit}
          sensorType={sensorType}
        />
      </div>

      {/* High-density Min / Avg / Max Summary */}
      <div className="mt-2.5 grid grid-cols-3 border-t border-[var(--color-border)] pt-2 text-center">
        <div className="pr-1.5">
          <div className="text-[11px] font-bold tabular-nums text-[var(--color-text)]">
            {minimum != null ? formatValue(minimum) : "--"}
          </div>
          <div className="mt-0.5 text-[8px] font-semibold uppercase text-[var(--color-text-muted)]">MIN</div>
        </div>
        <div className="border-l border-[var(--color-border)] px-1.5">
          <div className="text-[11px] font-bold tabular-nums text-[var(--color-text)]">
            {average != null ? formatValue(average) : "--"}
          </div>
          <div className="mt-0.5 text-[8px] font-semibold uppercase text-[var(--color-text-muted)]">AVG</div>
        </div>
        <div className="border-l border-[var(--color-border)] pl-1.5">
          <div className="text-[11px] font-bold tabular-nums text-[var(--color-text)]">
            {maximum != null ? formatValue(maximum) : "--"}
          </div>
          <div className="mt-0.5 text-[8px] font-semibold uppercase text-[var(--color-text-muted)]">MAX</div>
        </div>
      </div>
    </div>
  );
}
