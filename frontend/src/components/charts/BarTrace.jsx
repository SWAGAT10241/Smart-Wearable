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

  if (visibleValues.length < 2) {
    return (
      <div className="flex h-[86px] items-center justify-center text-[10px] font-medium text-[var(--color-text-muted)]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid h-[86px] grid-cols-[34px_minmax(0,1fr)] gap-2">
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

        <div className="relative flex h-full items-end gap-[7px] px-1">
          {visibleValues.map((value, index) => {
            const safeValue = Math.min(Math.max(value, 0), 100);

            return (
              <span
                key={`${value}-${index}`}
                className="w-[3px] shrink-0 rounded-full transition-all duration-500"
                style={{
                  height: `${Math.max(3, safeValue)}%`,
                  background: color,
                  opacity:
                    index % 3 === 0 ? 0.42 : index % 3 === 1 ? 0.62 : 0.82,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

