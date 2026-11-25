import React from "react";

/**
 * Clinical spectrum thermal gauge for environmental temperature.
 * Features 10°C to 40°C range scale, multi-hue thermal spectrum gradient,
 * dynamic indicator thumb, and theme-adaptive typography.
 */
export default function TemperatureGauge({ temperature }) {
  const numericTemperature = Number(temperature);

  const pct = Number.isFinite(numericTemperature)
    ? Math.min(100, Math.max(0, ((numericTemperature - 10) / 30) * 100))
    : 0;

  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-2.5 px-1">
      {/* Thermal Gradient Track */}
      <div className="relative h-6 w-full flex items-center">
        {/* Full Track with Spectrum Gradient in OKLCH */}
        <div
          className="absolute left-0 right-0 h-2 rounded-full border border-[var(--border-default)] dark:border-white/[0.08]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.72 0.15 230) 0%, oklch(0.75 0.16 155) 35%, oklch(0.72 0.18 60) 70%, oklch(0.65 0.24 16) 100%)",
          }}
        />

        {/* Sliding Indicator Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center h-4 w-4 rounded-full bg-white transition-all duration-700 ease-out shadow-md"
          style={{
            left: `calc(${pct}% - 8px)`,
            border: "2.5px solid oklch(0.68 0.18 58)",
            boxShadow: "0 0 10px oklch(0.68 0.18 58 / 0.60)",
          }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.68_0.18_58)]" />
        </div>
      </div>

      {/* Calibrated Thermal Scale Labels */}
      <div className="flex items-center justify-between font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">
        <span className="text-sky-600 dark:text-sky-400 font-bold">10°C Cool</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-black">22°C Ideal</span>
        <span className="text-rose-600 dark:text-rose-400 font-bold">40°C High</span>
      </div>
    </div>
  );
}
