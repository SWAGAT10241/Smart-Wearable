import * as React from "react";

export function Badge({ className = "", variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-emerald-500 text-white shadow-xs hover:bg-emerald-600",
    secondary: "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
    outline: "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300",
    tactical: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono tracking-wider",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono tracking-wider",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
