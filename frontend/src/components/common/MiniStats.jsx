import React from "react";

/**
 * Reusable 3-column statistical summary component (e.g. Min, Avg, Peak).
 * Fully theme-adaptive: high contrast across light & dark themes.
 *
 * @param {object} props
 * @param {Array<[string, string|number]>} props.items - Array of [label, value] tuples
 */
export default function MiniStats({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 rounded-xl border border-black/15 dark:border-white/10 bg-white/75 dark:bg-black/30 backdrop-blur-md p-2">
      {items.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className={`min-w-0 text-center ${
            index > 0 ? "border-l border-black/15 dark:border-white/10" : ""
          } px-1.5`}
        >
          <div className="truncate font-mono text-xs font-black tabular-nums text-slate-950 dark:text-white sm:text-sm">
            {value}
          </div>

          <div className="mt-0.5 truncate font-mono text-[9px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
