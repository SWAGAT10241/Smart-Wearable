import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

/* =======================================================
 * Updated Time
 * ======================================================= */

function formatUpdatedTime(timestamp) {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const difference = Math.max(0, Date.now() - date.getTime());

  const seconds = Math.floor(difference / 1000);

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds} sec ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/* =======================================================
 * Updated Time Hook
 * ======================================================= */

function useUpdatedTime(timestamp) {
  const [, setNow] = useState(Date.now());

  useEffect(() => {
    if (!timestamp) {
      return undefined;
    }

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, [timestamp]);

  return formatUpdatedTime(timestamp);
}

/* =======================================================
 * Mini Stats
 * ======================================================= */

function MiniStats({ items = [] }) {
  if (items.length !== 3) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 border-t border-slate-100 pt-4">
      {items.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className={`min-w-0 ${
            index > 0 ? "border-l border-slate-200 pl-3" : "pr-3"
          } ${index === 2 ? "pl-3 pr-0" : ""}`}
        >
          <div
            className="
                truncate
                text-[15px]
                font-semibold
                leading-5
                tabular-nums
                text-slate-900
              "
          >
            {value}
          </div>

          <div
            className="
                mt-1
                truncate
                text-[10px]
                font-medium
                text-slate-400
              "
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =======================================================
 * Line Chart
 *
 * Used for:
 * - Heart Rate
 * - Pressure
 *
 * IMPORTANT:
 *
 * This receives REAL sensor values.
 *
 * Heart:
 * 75, 78, 82, 79, 85
 *
 * Pressure:
 * 1010.2, 1011.4, 1009.8
 *
 * It never converts raw IR into BPM.
 * ======================================================= */

function LineTrace({
  color,
  samples = [],
  emptyText = "Waiting for data...",
  sensorType = "generic",
}) {
  const values = Array.isArray(samples)
    ? samples
        .map((item) => {
          if (typeof item === "number" || typeof item === "string") {
            return Number(item);
          }

          if (item && typeof item === "object") {
            if (Number.isFinite(Number(item.value))) {
              return Number(item.value);
            }

            if (
              sensorType === "heart" &&
              Number.isFinite(Number(item.heartRate))
            ) {
              return Number(item.heartRate);
            }

            if (
              sensorType === "pressure" &&
              Number.isFinite(Number(item.pressure))
            ) {
              return Number(item.pressure);
            }
          }

          return NaN;
        })
        .filter(Number.isFinite)
    : [];

  const visibleValues = values.slice(-30);

  if (visibleValues.length < 2) {
    return (
      <div
        className="
          flex
          h-[86px]
          items-center
          justify-center
          text-[10px]
          font-medium
          text-slate-300
        "
      >
        {emptyText}
      </div>
    );
  }

  /* =====================================================
   * Sensor-specific minimum ranges
   * ===================================================== */

  const settings = {
    heart: {
      minimumRange: 20,
      rounding: 0,
    },

    pressure: {
      minimumRange: 6,
      rounding: 1,
    },

    generic: {
      minimumRange: 10,
      rounding: 1,
    },
  };

  const config = settings[sensorType] || settings.generic;

  /* =====================================================
   * Dynamic scale
   * ===================================================== */

  const dataMin = Math.min(...visibleValues);
  const dataMax = Math.max(...visibleValues);
  const dataRange = dataMax - dataMin;
  const effectiveRange = Math.max(dataRange, config.minimumRange);

  /*
   * Smaller padding = more visible movement.
   */

  const padding = effectiveRange * 0.15;
  let chartMin = dataMin - padding;
  let chartMax = dataMax + padding;

  /*
   * If variation is tiny, center around
   * the actual sensor values.
   */

  if (dataRange < config.minimumRange) {
    const center = (dataMin + dataMax) / 2;
    chartMin = center - effectiveRange / 2;
    chartMax = center + effectiveRange / 2;
  }

  /* =====================================================
   * Round scale
   * ===================================================== */

  const factor = 10 ** config.rounding;
  chartMin = Math.floor(chartMin * factor) / factor;
  chartMax = Math.ceil(chartMax * factor) / factor;
  if (chartMax <= chartMin) {
    chartMax = chartMin + config.minimumRange;
  }

  const range = chartMax - chartMin;

  /* =====================================================
   * SVG
   * ===================================================== */

  const width = 300;
  const height = 86;

  /* =====================================================
   * Labels
   * ===================================================== */

  const middle = chartMin + range / 2;

  const formatLabel = (value) => {
    if (config.rounding === 0) {
      return Math.round(value);
    }

    return Number(value.toFixed(config.rounding));
  };

  const labels = [
    formatLabel(chartMax),
    formatLabel(middle),
    formatLabel(chartMin),
  ];

  /* =====================================================
   * Data points
   * ===================================================== */

  const points = visibleValues
    .map((value, index) => {
      const x = 4 + (index / (visibleValues.length - 1)) * (width - 8);
      const safeValue = Math.min(Math.max(value, chartMin), chartMax);
      const y = 6 + ((chartMax - safeValue) / range) * (height - 12);
      return `${x},${y}`;
    })
    .join(" ");

  /* =====================================================
   * Latest point
   * ===================================================== */

  const lastValue = visibleValues[visibleValues.length - 1];
  const lastX = width - 4;
  const safeLastValue = Math.min(Math.max(lastValue, chartMin), chartMax);
  const lastY = 6 + ((chartMax - safeLastValue) / range) * (height - 12);

  return (
    <div
      className="
        grid
        h-[86px]
        grid-cols-[34px_minmax(0,1fr)]
        gap-2
      "
    >
      {/* Y axis */}

      <div
        className="
          flex
          h-full
          flex-col
          justify-between
          py-[1px]
        "
      >
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="
                text-[9px]
                font-medium
                leading-none
                tabular-nums
                text-slate-400
              "
          >
            {label}
          </span>
        ))}
      </div>

      {/* Graph */}

      <div
        className="
          relative
          min-w-0
          overflow-hidden
        "
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          {/* Guide lines */}

          {[0, 1, 2].map((index) => {
            const y = 6 + (index / 2) * (height - 12);

            return (
              <line
                key={index}
                x1="0"
                x2={width}
                y1={y}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            );
          })}

          {/* REAL DATA */}

          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Latest reading */}

          <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
        </svg>
      </div>
    </div>
  );
}

/* =======================================================
 * Humidity Bar Chart
 * ======================================================= */

function BarTrace({ color, samples = [], emptyText = "Waiting for data..." }) {
  const values = Array.isArray(samples)
    ? samples
        .map((item) => {
          if (typeof item === "number" || typeof item === "string") {
            return Number(item);
          }

          if (item && typeof item === "object") {
            if (Number.isFinite(Number(item.value))) {
              return Number(item.value);
            }

            if (Number.isFinite(Number(item.humidity))) {
              return Number(item.humidity);
            }
          }

          return NaN;
        })
        .filter(Number.isFinite)
    : [];

  const visibleValues = values.slice(-20);

  if (visibleValues.length < 2) {
    return (
      <div
        className="
          flex
          h-[86px]
          items-center
          justify-center
          text-[10px]
          font-medium
          text-slate-300
        "
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        h-[86px]
        grid-cols-[34px_minmax(0,1fr)]
        gap-2
      "
    >
      <div
        className="
          flex
          h-full
          flex-col
          justify-between
          py-[1px]
        "
      >
        <span className="text-[9px] font-medium text-slate-400">100</span>

        <span className="text-[9px] font-medium text-slate-400">50</span>

        <span className="text-[9px] font-medium text-slate-400">0</span>
      </div>

      <div className="relative min-w-0">
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            flex
            flex-col
            justify-between
          "
        >
          <div className="border-t border-dashed border-slate-200" />
          <div className="border-t border-dashed border-slate-200" />
          <div className="border-t border-dashed border-slate-200" />
        </div>

        <div
          className="
            relative
            flex
            h-full
            items-end
            gap-[7px]
            px-1
          "
        >
          {visibleValues.map((value, index) => {
            const safeValue = Math.min(Math.max(value, 0), 100);

            return (
              <span
                key={`${value}-${index}`}
                className="
                    w-[3px]
                    shrink-0
                    rounded-full
                    transition-all
                    duration-500
                  "
                style={{
                  height: `${Math.max(3, safeValue)}%`,
                  background: color,
                  opacity:
                    index % 3 === 0 ? 0.42 : index % 3 === 1 ? 0.62 : 0.82,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =======================================================
 * SpO2 Gauge
 * ======================================================= */

function GaugeBar({ pct = 0, color }) {
  const value = Math.min(Math.max(Number(pct) || 0, 0), 100);

  return (
    <div className="relative h-[72px] w-full">
      <div
        className="
          absolute
          left-0
          right-0
          top-[32px]
          h-[7px]
          rounded-full
        "
        style={{
          background: `${color}25`,
        }}
      />

      <div
        className="
          absolute
          left-0
          top-[32px]
          h-[7px]
          rounded-full
          transition-all
          duration-700
        "
        style={{
          width: `${value}%`,
          background: color,
        }}
      />

      <span
        className="
          absolute
          top-[26px]
          h-[18px]
          w-[18px]
          rounded-full
          bg-white
          transition-all
          duration-700
        "
        style={{
          left: `calc(${value}% - 9px)`,
          border: `2px solid ${color}`,
          boxShadow: `0 2px 8px ${color}55`,
        }}
      />
    </div>
  );
}

/* =======================================================
 * Temperature Gauge
 * ======================================================= */

function TemperatureGauge({ temperature }) {
  const numericTemperature = Number(temperature);

  const pct = Number.isFinite(numericTemperature)
    ? Math.min(100, Math.max(0, ((numericTemperature - 10) / 30) * 100))
    : 0;

  return (
    <div className="relative h-[72px] w-full">
      <div
        className="
          absolute
          left-0
          right-0
          top-[32px]
          h-[7px]
          rounded-full
        "
        style={{
          background:
            "linear-gradient(90deg,#1976D2,#18BFC1,#9DDC67,#F2A93B,#F59E0B)",
        }}
      />

      <span
        className="
          absolute
          top-[26px]
          h-[19px]
          w-[19px]
          rounded-full
          bg-white
          transition-all
          duration-700
        "
        style={{
          left: `calc(${pct}% - 9.5px)`,
          border: "2px solid #F2A93B",
          boxShadow: "0 2px 8px rgba(242,169,59,0.35)",
        }}
      />
    </div>
  );
}

/* =======================================================
 * Sensor Styles
 * ======================================================= */

const STYLES = {
  heart: {
    bg: "#FFF0F3",
    color: "#FF3B5C",
  },

  oxygen: {
    bg: "#E8F2FF",
    color: "#1976D2",
  },

  temperature: {
    bg: "#FFF5E5",
    color: "#F2A93B",
  },

  humidity: {
    bg: "#E4F9F8",
    color: "#18BFC1",
  },

  pressure: {
    bg: "#F1EAFF",
    color: "#8B5CF6",
  },
};

/* =======================================================
 * StatCard
 * ======================================================= */

export default function StatCard({
  icon,
  iconType,
  label,
  value,
  unit,
  status,
  statusColor = "#2BAE8A",
  variant = "plain",
  gaugePct = 0,
  miniStats = [],
  signal = [],
  normalRange,
  updatedAt,
}) {
  const style = STYLES[iconType] || STYLES.oxygen;

  const updatedText = useUpdatedTime(updatedAt);

  return (
    <article
      className="
        flex
        min-w-0
        flex-col
        rounded-[24px]
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-[var(--shadow-card)]
      "
    >
      {/* Icon */}

      <div
        className="
          mb-5
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-[14px]
        "
        style={{
          background: style.bg,
        }}
      >
        {icon}
      </div>

      {/* Title + Status */}

      <div
        className="
          mb-3
          flex
          min-h-[22px]
          items-center
          justify-between
          gap-2
        "
      >
        <span
          className="
            min-w-0
            truncate
            text-[12px]
            font-medium
            tracking-[0.04em]
            text-slate-500
          "
        >
          {label}
        </span>

        {status && (
          <span
            className="
              shrink-0
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-semibold
            "
            style={{
              background: `${statusColor}18`,
              color: statusColor,
            }}
          >
            {status}
          </span>
        )}
      </div>

      {/* Current Value */}

      <div
        className="
          mb-5
          flex
          min-h-[42px]
          items-baseline
          gap-1.5
        "
      >
        <span
          className="
            text-[32px]
            font-bold
            leading-none
            tracking-[-0.035em]
            tabular-nums
            text-slate-900
          "
        >
          {value}
        </span>

        {unit && (
          <span
            className="
              text-[13px]
              font-medium
              text-slate-500
            "
          >
            {unit}
          </span>
        )}
      </div>

      {/* Sensor Visual */}

      <div
        className={
          variant === "ppg" ||
          variant === "line" ||
          variant === "bars" ||
          variant === "pressure"
            ? "mb-2 h-[86px]"
            : "mb-2 h-[72px]"
        }
      >
        {variant === "ppg" && (
          <LineTrace
            color={style.color}
            samples={signal}
            sensorType="heart"
            emptyText="Waiting for pulse data..."
          />
        )}

        {variant === "line" && (
          <LineTrace
            color={style.color}
            samples={signal}
            sensorType="generic"
          />
        )}

        {variant === "bars" && (
          <BarTrace
            color={style.color}
            samples={signal}
            emptyText="Waiting for humidity data..."
          />
        )}

        {variant === "gauge" && <GaugeBar pct={gaugePct} color={style.color} />}

        {variant === "tempGauge" && <TemperatureGauge temperature={value} />}

        {variant === "pressure" && (
          <LineTrace
            color={style.color}
            samples={signal}
            sensorType="pressure"
            emptyText="Waiting for pressure data..."
          />
        )}

        {variant === "plain" && <div className="h-[72px]" />}
      </div>

      {/* Normal Range */}

      {normalRange && (
        <div
          className="
            mb-5
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-2
              w-2
              shrink-0
              rounded-full
            "
            style={{
              background: "#20B486",
            }}
          />

          <span
            className="
              text-[10px]
              font-medium
              text-slate-500
            "
          >
            {normalRange}
          </span>
        </div>
      )}

      {/* Min / Avg / Max */}

      <div className="mt-auto">
        <MiniStats items={miniStats} />
      </div>

      {/* Updated */}

      {updatedText && (
        <div
          className="
            mt-4
            flex
            items-center
            gap-1.5
            border-t
            border-slate-100
            pt-3
            text-[10px]
            font-medium
            text-slate-400
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-[#8AA0C2]
            "
          >
            <Clock3 size={15} strokeWidth={1.7} />
            <span>Last seen {updatedText}</span>
          </div>
        </div>
      )}
    </article>
  );
}
