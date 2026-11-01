import Sparkline from "./Sparkline";

export default function ChartCard({ title, points, color, unit }) {
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
    <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] transition hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Historical trend</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold tabular-nums text-[var(--color-text)]">
            {latest != null ? formatValue(latest) : "--"}
          </div>
          {unit && <div className="text-[11px] text-[var(--color-text-muted)]">{unit}</div>}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
        <Sparkline points={values} color={color} />
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-3 border-t border-[var(--color-border)] pt-4">
        <div className="pr-3">
          <div className="text-sm font-semibold tabular-nums text-[var(--color-text)]">
            {minimum != null ? formatValue(minimum) : "--"}
          </div>
          <div className="mt-1 text-[10px] font-medium text-[var(--color-text-muted)]">MIN</div>
        </div>
        <div className="border-l border-[var(--color-border)] px-3">
          <div className="text-sm font-semibold tabular-nums text-[var(--color-text)]">
            {average != null ? formatValue(average) : "--"}
          </div>
          <div className="mt-1 text-[10px] font-medium text-[var(--color-text-muted)]">AVG</div>
        </div>
        <div className="border-l border-[var(--color-border)] pl-3">
          <div className="text-sm font-semibold tabular-nums text-[var(--color-text)]">
            {maximum != null ? formatValue(maximum) : "--"}
          </div>
          <div className="mt-1 text-[10px] font-medium text-[var(--color-text-muted)]">MAX</div>
        </div>
      </div>
    </div>
  );
}
