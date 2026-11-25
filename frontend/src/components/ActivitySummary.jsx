import { GiRunningShoe } from "react-icons/gi";
import { LuAlarmClock } from "react-icons/lu";
import { FaMountainSun } from "react-icons/fa6";
import { ImFire } from "react-icons/im";

/* =======================================================
 * Mini Graph
 * ======================================================= */

function MiniGraph({ points = [], color }) {
  if (!Array.isArray(points) || points.length < 2) {
    return <div className="mt-[var(--space-2)] h-[var(--dash-activity-graph-height)] w-full" />;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 150;
  const height = 32;
  const padding = 2;

  const path = points
    .map((value, index) => {
      const x = padding + (index / (points.length - 1)) * (width - padding * 2);
      const y =
        height - padding - ((value - min) / range) * (height - padding * 2);

      return `${index ? "L" : "M"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-[var(--space-2)] h-[var(--dash-activity-graph-height)] w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
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
    color: "var(--action-primary)",
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
    <div className="flex min-w-0 items-center gap-[var(--card-gap)] px-[var(--dash-activity-item-px)] py-[var(--dash-activity-item-py)] transition-colors hover:bg-[var(--surface-hover)]">
      {/* Icon */}

      <div
        className="flex h-[var(--dash-icon-box-lg)] w-[var(--dash-icon-box-lg)] shrink-0 items-center justify-center rounded-full border"
        style={{
          background: `linear-gradient(145deg, ${color}25, ${color}08)`,
          borderColor: `${color}45`,
          boxShadow: `0 0 16px ${color}20, inset 0 0 10px ${color}15`,
          color,
        }}
      >
        <span className="text-[length:var(--dash-activity-icon-size)]">{icon}</span>
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {label}
        </div>

        <div className="mt-[var(--space-1)] flex items-baseline gap-[var(--space-1)]">
          <span className="truncate text-xl font-bold leading-none tracking-[-0.025em] tabular-nums text-[var(--color-text)] sm:text-2xl">
            {value ?? "--"}
          </span>

          {unit && value != null && (
            <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
              {unit}
            </span>
          )}
        </div>

        <div className="mt-[var(--space-1)] text-xs font-medium text-[var(--color-text-muted)]">
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
      label: "ELEVATION GAIN",
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
    <section className="overflow-hidden rounded-[var(--card-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
      {/* Header */}

      <div className="border-b border-[var(--color-border)] px-[var(--card-padding)] py-[var(--space-4)]">
        <div className="flex items-center justify-between gap-[var(--card-gap)]">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--color-text)]">
              Activity Summary
            </h2>

            <p className="mt-[var(--space-0-5)] text-xs text-[var(--color-text-muted)]">
              Today's trail activity
            </p>
          </div>

          <span className="rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-[var(--dash-badge-padding-x)] py-[var(--dash-badge-padding-y)] text-[length:var(--dash-badge-text-size)] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            TODAY
          </span>
        </div>
      </div>

      {/* Four activity metrics only */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {items.map(({ key, ...itemProps }, index) => (
          <div
            key={key}
            className={`relative ${
              index > 0
                ? "after:absolute after:left-0 after:top-6 after:h-[calc(100%-3rem)] after:w-px after:bg-[var(--color-border)]"
                : ""
            }`}
          >
            <SummaryItem {...itemProps} />
          </div>
        ))}
      </div>
    </section>
  );
}
