import React from "react";
import { GiRunningShoe } from "react-icons/gi";
import { LuAlarmClock } from "react-icons/lu";
import { FaMountainSun } from "react-icons/fa6";
import { ImFire } from "react-icons/im";

/* =======================================================
 * Mini Sparkline Graph
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
  icon,
  color,
  graphPoints,
}) {
  return (
    <div className="flex min-w-0 items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-[var(--color-surface-alt)]/40">
      {/* Icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border text-lg shadow-2xs tg-squircle-sm"
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
        <div className="tg-metric-label">
          {label}
        </div>

        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="truncate text-2xl font-bold leading-none tracking-tight tabular-nums text-[var(--color-text)]">
            {value ?? "--"}
          </span>

          {unit && value != null && (
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              {unit}
            </span>
          )}
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
      icon: <GiRunningShoe />,
      ...ACTIVITY_STYLES.distance,
      graphPoints: distancePoints,
    },
    {
      key: "duration",
      label: "DURATION",
      value: duration,
      unit: "",
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
      icon: <FaMountainSun />,
      ...ACTIVITY_STYLES.elevation,
      graphPoints: elevationPoints,
    },
    {
      key: "calories",
      label: "CALORIES",
      value: calories != null ? Math.round(calories).toLocaleString() : null,
      unit: "kcal",
      icon: <ImFire />,
      ...ACTIVITY_STYLES.calories,
      graphPoints: caloriePoints,
    },
  ];

  return (
    <section className="tg-card">
      {/* Top Accent Stroke */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-80"
        style={{
          background: "linear-gradient(90deg, var(--status-optimal), var(--status-info) 50%, transparent 80%)",
        }}
      />

      {/* Header Deck */}
      <div className="tg-card-header border-b border-[var(--color-border)] pb-3 mb-0">
        <h2 className="tg-card-title">
          Today's Activity
        </h2>

        <span className="tg-badge tg-badge-optimal font-mono text-[10px]">
          Session Active
        </span>
      </div>

      {/* Four metrics */}
      <div className="grid grid-cols-1 divide-y divide-[var(--color-border)] sm:grid-cols-2 sm:divide-y-0 sm:divide-x md:grid-cols-2 xl:grid-cols-4 xl:divide-y-0 xl:divide-x pt-1">
        {items.map(({ key, ...itemProps }) => (
          <div key={key} className="min-w-0">
            <SummaryItem {...itemProps} />
          </div>
        ))}
      </div>
    </section>
  );
}
