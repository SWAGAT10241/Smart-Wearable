import Sparkline from "./Sparkline";

export default function ChartCard({
  title,
  points,
  color,
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
    <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-sm transition hover:border-[var(--color-accent)]/30 hover:shadow-md">
      {/* Header */}
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-xs font-bold text-[var(--color-text)]">{title}</h3>
            {normalRange && (
              <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-emerald-400">
                {normalRange}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">Scale & History</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-base font-bold tabular-nums text-[var(--color-text)] leading-tight">
            {latest != null ? formatValue(latest) : "--"}
          </div>
          {unit && <div className="text-[9px] font-mono text-[var(--color-text-muted)]">{unit}</div>}
        </div>
      </div>

      {/* Chart with scale */}
      <div className="rounded-xl bg-[var(--color-surface-alt)] p-2">
        <Sparkline
          points={values}
          color={color}
          unit={unit}
          sensorType={sensorType}
        />
      </div>

      {/* Statistics */}
      <div className="mt-2.5 grid grid-cols-3 border-t border-[var(--color-border)] pt-2 text-center">
        <div className="pr-1.5">
          <div className="text-[11px] font-semibold tabular-nums text-[var(--color-text)]">
            {minimum != null ? formatValue(minimum) : "--"}
          </div>
          <div className="mt-0.5 text-[8px] font-medium uppercase text-[var(--color-text-muted)]">MIN</div>
        </div>
        <div className="border-l border-[var(--color-border)] px-1.5">
          <div className="text-[11px] font-semibold tabular-nums text-[var(--color-text)]">
            {average != null ? formatValue(average) : "--"}
          </div>
          <div className="mt-0.5 text-[8px] font-medium uppercase text-[var(--color-text-muted)]">AVG</div>
        </div>
        <div className="border-l border-[var(--color-border)] pl-1.5">
          <div className="text-[11px] font-semibold tabular-nums text-[var(--color-text)]">
            {maximum != null ? formatValue(maximum) : "--"}
          </div>
          <div className="mt-0.5 text-[8px] font-medium uppercase text-[var(--color-text-muted)]">MAX</div>
        </div>
      </div>
    </div>
  );
}
