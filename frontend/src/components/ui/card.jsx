import * as React from "react";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 text-slate-950 dark:text-slate-50 shadow-xl backdrop-blur-xl transition-all ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3
      className={`text-xl font-bold leading-none tracking-tight text-slate-900 dark:text-white ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }) {
  return (
    <p
      className={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }) {
  return <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />;
}
