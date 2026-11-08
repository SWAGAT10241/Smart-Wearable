import React from "react";
import Sparkline from "./Sparkline";

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
    <div className="tg-card justify-between hover:border-[var(--color-accent)]/50">
      {/* Top Accent Stroke */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-80"
        style={{ background: `linear-gradient(90deg, ${color}, transparent 65%)` }}
      />

      {/* Header Deck */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="tg-metric-label truncate">
              {title}
            </h3>
            {normalRange && (
              <span className="tg-badge tg-badge-optimal text-[10px] py-0 px-1.5">
                {normalRange.replace(/Norm: |Mild: |Comfort: |Std: /, "")}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xl font-bold tabular-nums text-[var(--color-text)] leading-tight font-sans">
            {latest != null ? formatValue(latest) : "--"}
          </div>
          {unit && <div className="text-[11px] text-[var(--color-text-muted)]">{unit}</div>}
        </div>
      </div>

      {/* Sparkline Viewport */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]/60 p-2 shadow-2xs">
        <Sparkline
          points={values}
          color={color}
          unit={unit}
          sensorType={sensorType}
        />
      </div>

      {/* Min / Avg / Max Summary */}
      <div className="mt-2.5 grid grid-cols-3 border-t border-[var(--color-border)] pt-2 text-center font-mono">
        <div className="pr-1.5">
          <div className="text-xs font-bold tabular-nums text-[var(--color-text)]">
            {minimum != null ? formatValue(minimum) : "--"}
          </div>
          <div className="mt-0.5 text-[9px] font-medium uppercase text-[var(--color-text-muted)]">Min</div>
        </div>
        <div className="border-l border-[var(--color-border)] px-1.5">
          <div className="text-xs font-bold tabular-nums text-[var(--color-text)]">
            {average != null ? formatValue(average) : "--"}
          </div>
          <div className="mt-0.5 text-[9px] font-medium uppercase text-[var(--color-text-muted)]">Avg</div>
        </div>
        <div className="border-l border-[var(--color-border)] pl-1.5">
          <div className="text-xs font-bold tabular-nums text-[var(--color-text)]">
            {maximum != null ? formatValue(maximum) : "--"}
          </div>
          <div className="mt-0.5 text-[9px] font-medium uppercase text-[var(--color-text-muted)]">Max</div>
        </div>
      </div>
    </div>
  );
}
