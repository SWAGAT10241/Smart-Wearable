import React from "react";

/**
 * Reusable 3-column statistical summary component (e.g. Min, Avg, Peak).
 *
 * @param {object} props
 * @param {Array<[string, string|number]>} props.items - Array of [label, value] tuples
 */
export default function MiniStats({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 border-t border-[var(--color-border)] pt-3">
      {items.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className={`min-w-0 ${
            index > 0 ? "border-l border-[var(--color-border)] pl-2.5" : "pr-2"
          } ${index === 2 ? "pl-2.5 pr-0" : ""}`}
        >
          <div className="truncate text-sm font-bold leading-5 tabular-nums text-[var(--color-text)] sm:text-base">
            {value}
          </div>

          <div className="mt-0.5 truncate text-xs font-semibold text-[var(--color-text-secondary)]">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

