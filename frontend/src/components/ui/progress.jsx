import * as React from "react";

export function Progress({ value = 0, max = 100, className = "", indicatorClassName = "", ...props }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${className}`}
      {...props}
    >
      <div
        className={`h-full w-full flex-1 bg-emerald-500 transition-all duration-300 ease-in-out ${indicatorClassName}`}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
