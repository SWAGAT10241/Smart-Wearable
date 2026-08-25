import { GiRunningShoe } from "react-icons/gi";
import { LuAlarmClock } from "react-icons/lu";
import { FaMountainSun } from "react-icons/fa6";
import { ImFire } from "react-icons/im";

function MiniGraph({ points = [], color }) {
  if (!points || points.length < 2) {
    return <div className="mt-2 h-7 w-full" />;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const width = 150;
  const height = 32;
  const padding = 2;

  const path = points
    .map((value, index) => {
      const x =
        padding +
        (index / (points.length - 1)) *
          (width - padding * 2);

      const y =
        height -
        padding -
        ((value - min) / range) *
          (height - padding * 2);

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-2 h-7 w-full"
      preserveAspectRatio="none"
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

function SummaryItem({
  label,
  value,
  unit,
  sub,
  icon,
  color,
  bg,
  graphPoints,
  positive = false,
}) {
  return (
    <div
      className="
        group
        flex min-w-0 items-center gap-4
        px-5 py-4
        transition-colors
        hover:bg-slate-50/60
      "
    >
      {/* Icon */}
      <div
        className="
          flex h-12 w-12 shrink-0
          items-center justify-center
          rounded-full
          transition-transform
          group-hover:scale-[1.03]
        "
        style={{
          background: bg,
          color,
        }}
      >
        <span className="text-[22px]">
          {icon}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </div>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="truncate text-[22px] font-bold leading-none tracking-[-0.025em] text-slate-900">
            {value ?? "--"}
          </span>

          {unit && value != null && (
            <span className="text-[12px] font-medium text-slate-600">
              {unit}
            </span>
          )}
        </div>

        <div
          className={`mt-1 text-[10px] ${
            positive
              ? "font-medium text-emerald-600"
              : "text-slate-400"
          }`}
        >
          {sub}
        </div>

        <MiniGraph
          points={graphPoints}
          color={color}
        />
      </div>
    </div>
  );
}

export default function ActivitySummary({
  distance = null,
  duration = null,
  elevationGain = null,
  calories = null,

  distancePoints = [],
  durationPoints = [],
  elevationPoints = [],
  caloriePoints = [],

  elevationChange = null,
}) {
  return (
  <section
    className="
      overflow-hidden
      rounded-[24px]
      border border-slate-200/80
      bg-white
      shadow-[var(--shadow-card)]
    "
  >
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      
      {/* Distance */}
      <div className="relative">
        <SummaryItem
          label="DISTANCE"
          value={
            distance != null
              ? Number(distance).toFixed(1)
              : null
          }
          unit="km"
          sub={
            distance != null
              ? "Today"
              : "No activity data"
          }
          icon={<GiRunningShoe />}
          color="#18BFA3"
          bg="#E4F9F3"
          graphPoints={distancePoints}
        />

        {/* Short divider */}
        <span className="
          absolute
          right-0
          top-1/2
          hidden
          h-16
          w-px
          -translate-y-1/2
          bg-slate-200
          xl:block
        " />
      </div>


      {/* Duration */}
      <div className="relative">
        <SummaryItem
          label="DURATION"
          value={duration}
          unit=""
          sub={
            duration != null
              ? "h:m:s"
              : "No activity data"
          }
          icon={<LuAlarmClock />}
          color="#1976D2"
          bg="#E8F2FF"
          graphPoints={durationPoints}
        />

        {/* Short divider */}
        <span className="
          absolute
          right-0
          top-1/2
          hidden
          h-16
          w-px
          -translate-y-1/2
          bg-slate-200
          xl:block
        " />
      </div>


      {/* Elevation */}
      <div className="relative">
        <SummaryItem
          label="ELEVATION GAIN"
          value={
            elevationGain != null
              ? Math.round(elevationGain).toLocaleString()
              : null
          }
          unit="m"
          sub={
            elevationChange != null
              ? `↑ ${elevationChange}% vs yesterday`
              : elevationGain != null
                ? "Today"
                : "No elevation data"
          }
          positive={
            elevationChange != null &&
            elevationChange > 0
          }
          icon={<FaMountainSun />}
          color="#8B5CF6"
          bg="#F1EAFF"
          graphPoints={elevationPoints}
        />

        {/* Short divider */}
        <span className="
          absolute
          right-0
          top-1/2
          hidden
          h-16
          w-px
          -translate-y-1/2
          bg-slate-200
          xl:block
        " />
      </div>


      {/* Calories */}
      <div>
        <SummaryItem
          label="CALORIES"
          value={
            calories != null
              ? Math.round(calories).toLocaleString()
              : null
          }
          unit="kcal"
          sub={
            calories != null
              ? "Today"
              : "No calorie data"
          }
          icon={<ImFire />}
          color="#F2A93B"
          bg="#FFF5E5"
          graphPoints={caloriePoints}
        />
      </div>

    </div>
  </section>
);
}