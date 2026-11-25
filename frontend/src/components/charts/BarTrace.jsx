import React from "react";

/**
 * Modern BarTrace chart component for environmental humidity distribution.
 * Features gradient vertical bars, tactical dashed gridlines, and theme-adaptive text.
 */
export default function BarTrace({
  color = "#0ea5e9",
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

  const visibleValues = values.slice(-16);
  const isBaseline = visibleValues.length < 2;
  const singleVal = visibleValues.length === 1 ? visibleValues[0] : null;

  const baselineBars = singleVal != null
    ? [singleVal - 3, singleVal - 1, singleVal + 2, singleVal - 2, singleVal + 3, singleVal, singleVal + 1, singleVal - 1, singleVal + 2, singleVal]
    : [42, 45, 48, 52, 50, 47, 49, 53, 51, 48, 46, 50, 52, 49];

  const chartValues = isBaseline ? baselineBars : visibleValues;

  return (
    <div className="relative grid h-[78px] grid-cols-[28px_minmax(0,1fr)] gap-2 items-center">
      <div className="flex h-full flex-col justify-between py-1 font-mono text-[9px] font-bold text-slate-700 dark:text-slate-300">
        <span>100%</span>
        <span>50%</span>
        <span>0%</span>
      </div>

      <div className="relative h-full min-w-0">
        {/* Subtle Dashed Gridlines */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-1">
          <div className="border-t border-dashed border-black/15 dark:border-white/10" />
          <div className="border-t border-dashed border-black/15 dark:border-white/10" />
          <div className="border-t border-dashed border-black/15 dark:border-white/10" />
        </div>

        {isBaseline && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="rounded bg-white/90 dark:bg-black/60 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border border-black/15 dark:border-white/10 shadow-xs backdrop-blur-sm">
              Standby
            </span>
          </div>
        )}

        <div className="relative flex h-full items-end justify-between px-1">
          {chartValues.map((value, index) => {
            const safeValue = Math.min(Math.max(value, 0), 100);

            return (
              <span
                key={`${value}-${index}`}
                className="w-2.5 rounded-t-sm transition-all duration-500"
                style={{
                  height: `${Math.max(6, safeValue)}%`,
                  background: `linear-gradient(to top, ${
                    typeof color === "string" && color.startsWith("oklch(")
                      ? color.replace(")", " / 0.25)")
                      : "rgba(2, 132, 199, 0.25)"
                  }, ${color})`,
                  opacity: isBaseline ? 0.45 : 0.85,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
