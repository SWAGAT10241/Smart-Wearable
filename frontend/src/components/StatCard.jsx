function MiniStats({ items = [] }) {
  if (items.length !== 3) return null;

  return (
    <div className="grid grid-cols-3 border-t border-slate-100 pt-3">
      {items.map(([label, value], index) => (
        <div
          key={label}
          className={`flex min-w-0 flex-col gap-1 ${
            index > 0 ? "border-l border-slate-200 pl-3" : "pr-3"
          } ${index === 2 ? "pl-3 pr-0" : ""}`}
        >
          <span className="truncate text-[12px] font-semibold leading-4 tabular-nums text-slate-800">
            {value}
          </span>

          <span className="truncate text-[9px] font-medium leading-3 text-slate-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function PpgTrace({ color, samples = [] }) {
  if (samples.length < 2) {
    return (
      <div className="flex h-10 items-center text-xs text-slate-300">
        Waiting for pulse signal...
      </div>
    );
  }

  const width = 300;
  const height = 40;
  const padding = 3;

  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const range = max - min || 1;

  const points = samples
    .map((value, index) => {
      const x =
        padding +
        (index / (samples.length - 1)) * (width - padding * 2);

      const y =
        height -
        padding -
        ((value - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex h-10 w-full items-center overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function GaugeBar({
  pct = 0,
  color,
  gradient,
  type = "normal",
}) {
  const value = Math.min(Math.max(Number(pct) || 0, 0), 100);

  return (
    <div className="relative h-10 w-full">
      <div
        className="absolute left-0 right-0 top-[17px] h-[6px] rounded-full"
        style={{
          background: gradient || `${color}22`,
        }}
      />

      {!gradient && (
        <div
          className="tg-gauge-fill absolute left-0 top-[17px] h-[6px] rounded-full"
          style={{
            width: `${value}%`,
            background: color,
          }}
        />
      )}

      <span
        className={`tg-gauge-dot absolute top-[13px] h-[14px] w-[14px] rounded-full bg-white ${
          type === "temperature" ? "tg-temp-dot" : ""
        }`}
        style={{
          left: `calc(${value}% - 7px)`,
          border: `2px solid ${color}`,
          boxShadow: `0 1px 5px ${color}55`,
        }}
      />
    </div>
  );
}

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
};

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
}) {
  const style = STYLES[iconType] || STYLES.oxygen;

  return (
    <article className="tg-stat-card flex min-w-0 flex-1 flex-col rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)]">

      {/* Icon */}
      <div
        className={`tg-stat-icon mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${
          iconType === "humidity" ? "tg-humidity-icon" : ""
        }`}
        style={{ background: style.bg }}
      >
        {icon}
      </div>

      {/* Label + Status */}
      <div className="mb-2 flex min-h-[24px] items-center justify-between gap-2">
        <span className="min-w-0 truncate text-[12px] font-medium tracking-[0.03em] text-slate-500">
          {label}
        </span>

        {status && (
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{
              background: `${statusColor}18`,
              color: statusColor,
            }}
          >
            {status}
          </span>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-2 flex min-h-[38px] items-baseline gap-1">
        <span className="text-[32px] font-bold leading-none tracking-[-0.03em] tabular-nums text-slate-900">
          {value}
        </span>

        <span className="text-[13px] font-medium text-slate-500">
          {unit}
        </span>
      </div>

      {/* Visualization
          Fixed height keeps all four cards aligned. */}
      <div className="mb-1 flex h-10 items-center">
        {variant === "ppg" && (
          <PpgTrace
            color={style.color}
            samples={signal}
          />
        )}

        {variant === "gauge" && (
          <GaugeBar
            pct={gaugePct}
            color={style.color}
          />
        )}

        {variant === "tempGauge" && (
          <GaugeBar
            pct={gaugePct}
            color={style.color}
            type="temperature"
            gradient="linear-gradient(90deg,#1976D2,#18BFC1,#9DDC67,#F2A93B,#F59E0B)"
          />
        )}

        {variant === "plain" &&
          iconType !== "humidity" && (
            <div className="h-10 w-full" />
          )}

        {iconType === "humidity" && (
          <div className="tg-humidity-wave">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {/* Three fixed sub-statistics */}
      <MiniStats items={miniStats} />

      <style>{`
        .tg-stat-card {
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease;
        }

        .tg-stat-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 14px 30px rgba(16, 42, 67, 0.10);
        }

        .tg-gauge-fill {
          transition: width 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .tg-gauge-dot {
          transition: left 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .tg-temp-dot {
          animation: tg-temperature-pulse 2s ease-in-out infinite;
        }

        @keyframes tg-temperature-pulse {
          0%,
          100% {
            box-shadow:
              0 1px 5px rgba(242, 169, 59, 0.25);
          }

          50% {
            box-shadow:
              0 1px 10px rgba(242, 169, 59, 0.55);
          }
        }

        .tg-humidity-icon {
          animation: tg-humidity-breathe 2.4s ease-in-out infinite;
        }

        @keyframes tg-humidity-breathe {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-2px);
          }
        }

        .tg-humidity-wave {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 18px;
          width: 100%;
          opacity: 0.55;
        }

        .tg-humidity-wave span {
          display: block;
          width: 3px;
          border-radius: 999px;
          background: #18bfc1;
          animation: tg-humidity-wave 1.5s ease-in-out infinite;
        }

        .tg-humidity-wave span:nth-child(1) {
          height: 7px;
          animation-delay: 0s;
        }

        .tg-humidity-wave span:nth-child(2) {
          height: 12px;
          animation-delay: 0.12s;
        }

        .tg-humidity-wave span:nth-child(3) {
          height: 17px;
          animation-delay: 0.24s;
        }

        .tg-humidity-wave span:nth-child(4) {
          height: 11px;
          animation-delay: 0.36s;
        }

        .tg-humidity-wave span:nth-child(5) {
          height: 6px;
          animation-delay: 0.48s;
        }

        @keyframes tg-humidity-wave {
          0%,
          100% {
            transform: scaleY(0.65);
            opacity: 0.45;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tg-stat-card,
          .tg-temp-dot,
          .tg-humidity-icon,
          .tg-humidity-wave span {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </article>
  );
}