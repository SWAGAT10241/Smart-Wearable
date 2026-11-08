import React from "react";
import { GiRunningShoe } from "react-icons/gi";
import { LuAlarmClock } from "react-icons/lu";
import { FaMountainSun } from "react-icons/fa6";
import { ImFire } from "react-icons/im";

/* =======================================================
 * Mini Tactical Sparkline Graph
 * ======================================================= */

function MiniGraph({ points = [], color = "#16B890" }) {
  if (!Array.isArray(points) || points.length < 2) {
    return <div className="mt-1.5 h-6 w-full opacity-0" />;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 140;
  const height = 26;
  const padding = 2;

  const path = points
    .map((value, index) => {
      const x = padding + (index / (points.length - 1)) * (width - padding * 2);
      const y =
        height - padding - ((value - min) / range) * (height - padding * 2);

      return `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const area = `${path} L ${width - padding} ${height} L ${padding} ${height} Z`;
  const gradId = `spark-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-1.5 h-6 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =======================================================
 * Activity Styles
 * ======================================================= */

const ACTIVITY_STYLES = {
  distance: {
    color: "var(--status-optimal)",
  },
  duration: {
    color: "var(--status-info)",
  },
  elevation: {
    color: "var(--status-info)",
  },
  calories: {
    color: "var(--status-warning)",
  },
};

/* =======================================================
 * Summary Item
 * ======================================================= */

function SummaryItem({
  label,
  value,
  unit,
  sub,
  icon,
  color,
  graphPoints,
}) {
  return (
    <div className="flex min-w-0 items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-[var(--color-surface-alt)]/40 font-mono">
      {/* Tactical Icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg shadow-2xs"
        style={{
          background: `${color}14`,
          borderColor: `${color}35`,
          color,
        }}
      >
        <span>{icon}</span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {label}
        </div>

        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="truncate text-xl font-black leading-none tracking-tight tabular-nums text-[var(--color-text)]">
            {value ?? "--"}
          </span>

          {unit && value != null && (
            <span className="text-[10px] font-bold uppercase text-[var(--color-text-secondary)]">
              {unit}
            </span>
          )}
        </div>

        <div className="mt-0.5 text-[10px] text-[var(--color-text-muted)] truncate">
          {sub}
        </div>

        <MiniGraph points={graphPoints} color={color} />
      </div>
    </div>
  );
}

/* =======================================================
 * Activity Summary
 * ======================================================= */

export default function ActivitySummary({
  distance = null,
  duration = null,
  elevationGain = null,
  calories = null,
  distancePoints = [],
  durationPoints = [],
  elevationPoints = [],
  caloriePoints = [],
}) {
  const items = [
    {
      key: "distance",
      label: "DISTANCE",
      value: distance != null ? Number(distance).toFixed(1) : null,
      unit: "km",
      sub: distance != null ? "Trail distance" : "No activity data",
      icon: <GiRunningShoe />,
      ...ACTIVITY_STYLES.distance,
      graphPoints: distancePoints,
    },
    {
      key: "duration",
      label: "DURATION",
      value: duration,
      unit: "",
      sub: duration != null ? "Active trail time" : "No activity data",
      icon: <LuAlarmClock />,
      ...ACTIVITY_STYLES.duration,
      graphPoints: durationPoints,
    },
    {
      key: "elevation",
      label: "ELEVATION",
      value:
        elevationGain != null
          ? Math.round(elevationGain).toLocaleString()
          : null,
      unit: "m",
      sub: elevationGain != null ? "Total ascent" : "No elevation data",
      icon: <FaMountainSun />,
      ...ACTIVITY_STYLES.elevation,
      graphPoints: elevationPoints,
    },
    {
      key: "calories",
      label: "CALORIES",
      value: calories != null ? Math.round(calories).toLocaleString() : null,
      unit: "kcal",
      sub: calories != null ? "Estimated burn" : "No calorie data",
      icon: <ImFire />,
      ...ACTIVITY_STYLES.calories,
      graphPoints: caloriePoints,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
      {/* Tactical Top Accent Indicator */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-70"
        style={{
          background: "linear-gradient(90deg, var(--status-optimal), var(--status-info) 50%, transparent 80%)",
        }}
      />

      {/* Subtle Corner Crosshairs */}
      <span className="pointer-events-none absolute top-1.5 right-2 font-mono text-[8px] text-[var(--color-text-muted)] select-none opacity-30">
        +
      </span>
      <span className="pointer-events-none absolute bottom-1.5 left-2 font-mono text-[8px] text-[var(--color-text-muted)] select-none opacity-30">
        +
      </span>

      {/* Header Deck */}
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-text)]">
              TRAIL SESSION ACTIVITY
            </span>
          </div>

          <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--status-optimal)]">
            LIVE WINDOW
          </span>
        </div>
      </div>

      {/* Four high-density activity metrics */}
      <div className="grid grid-cols-1 divide-y divide-[var(--color-border)] sm:grid-cols-2 sm:divide-y-0 sm:divide-x md:grid-cols-2 xl:grid-cols-4 xl:divide-y-0 xl:divide-x">
        {items.map(({ key, ...itemProps }) => (
          <div key={key} className="min-w-0">
            <SummaryItem {...itemProps} />
          </div>
        ))}
      </div>
    </section>
  );
}
