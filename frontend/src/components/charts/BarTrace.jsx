import React from "react";

/**
 * Bar trace chart component for humidity and percentage distributions.
 */
export default function BarTrace({
  color,
  samples = [],
  emptyText = "Waiting for data...",
}) {
  const values = Array.isArray(samples)
    ? samples
        .map((item) => {
          if (typeof item === "number" || typeof item === "string") {
            return Number(item);
          }

          if (item && typeof item === "object") {
            if (Number.isFinite(Number(item.value))) return Number(item.value);
            if (Number.isFinite(Number(item.humidity))) {
              return Number(item.humidity);
            }
          }

          return NaN;
        })
        .filter(Number.isFinite)
    : [];

  const visibleValues = values.slice(-20);
  const isBaseline = visibleValues.length < 2;
  const singleVal = visibleValues.length === 1 ? visibleValues[0] : null;

  const baselineBars = singleVal != null
    ? [singleVal - 3, singleVal - 1, singleVal + 2, singleVal - 2, singleVal + 3, singleVal, singleVal + 1, singleVal - 1, singleVal + 2, singleVal]
    : [42, 45, 48, 52, 50, 47, 49, 53, 51, 48, 46, 50, 52, 49];

  const chartValues = isBaseline ? baselineBars : visibleValues;

  return (
    <div className="relative grid h-[86px] grid-cols-[34px_minmax(0,1fr)] gap-2">
      <div className="flex h-full flex-col justify-between py-[1px]">
        {["100", "50", "0"].map((value) => (
          <span
            key={value}
            className="text-[9px] font-medium text-[var(--color-text-muted)]"
          >
            {value}
          </span>
        ))}
      </div>

      <div className="relative min-w-0">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          <div className="border-t border-dashed border-[var(--color-border)]" />
          <div className="border-t border-dashed border-[var(--color-border)]" />
          <div className="border-t border-dashed border-[var(--color-border)]" />
        </div>

        {isBaseline && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="rounded bg-[var(--color-surface)]/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] backdrop-blur-sm border border-[var(--color-border)]">
              Standby
            </span>
          </div>
        )}

        <div className="relative flex h-full items-end gap-[7px] px-1">
          {chartValues.map((value, index) => {
            const safeValue = Math.min(Math.max(value, 0), 100);

            return (
              <span
                key={`${value}-${index}`}
                className="w-[3.5px] shrink-0 rounded-t-full transition-all duration-500"
                style={{
                  height: `${Math.max(4, safeValue)}%`,
                  background: isBaseline
                    ? color
                    : `linear-gradient(180deg, ${color} 0%, ${color}55 100%)`,
                  opacity: isBaseline
                    ? 0.35
                    : index % 3 === 0
                      ? 0.55
                      : index % 3 === 1
                        ? 0.75
                        : 0.95,
                  boxShadow: !isBaseline && safeValue > 50 ? `0 0 6px ${color}40` : "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

