import React from "react";

/**
 * Minimalist high-density tactical 3-column statistical summary component (e.g. Min, Avg, Peak).
 *
 * @param {object} props
 * @param {Array<[string, string|number]>} props.items - Array of [label, value] tuples
 */
export default function MiniStats({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 border-t border-[var(--color-border)] pt-2.5 font-mono">
      {items.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className={`min-w-0 ${
            index > 0 ? "border-l border-[var(--color-border)] pl-2" : "pr-2"
          } ${index === 2 ? "pl-2 pr-0" : ""}`}
        >
          <div className="truncate text-xs font-bold leading-none tabular-nums text-[var(--color-text)] sm:text-sm">
            {value}
          </div>

          <div className="mt-1 truncate text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
