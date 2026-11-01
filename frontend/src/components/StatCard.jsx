import React from "react";
import { Clock3 } from "lucide-react";
import useUpdatedTime from "../hooks/useUpdatedTime";
import MiniStats from "./common/MiniStats";
import { LineTrace, BarTrace, GaugeBar, TemperatureGauge } from "./charts";

/* =======================================================
 * Sensor Visual Styles
 * ======================================================= */
const STATUS_COLORS = {
  live: "#2DD4BF",
  normal: "#34D399",
  mild: "#FBBF24",
  warning: "#FBBF24",
  alert: "#F87171",
};

const STYLES = {
  heart: {
    bg: "linear-gradient(145deg,rgba(255,59,92,.22),rgba(255,59,92,.06))",
    color: "#FF4D6D",
    glow: "rgba(255,59,92,.28)",
  },
  oxygen: {
    bg: "linear-gradient(145deg,rgba(25,118,210,.24),rgba(25,118,210,.06))",
    color: "#2196F3",
    glow: "rgba(33,150,243,.30)",
  },
  temperature: {
    bg: "linear-gradient(145deg,rgba(242,169,59,.24),rgba(242,169,59,.06))",
    color: "#FFB84D",
    glow: "rgba(242,169,59,.28)",
  },
  humidity: {
    bg: "linear-gradient(145deg,rgba(24,191,193,.24),rgba(24,191,193,.06))",
    color: "#22D3D5",
    glow: "rgba(24,191,193,.28)",
  },
  pressure: {
    bg: "linear-gradient(145deg,rgba(139,92,246,.24),rgba(139,92,246,.06))",
    color: "#A78BFA",
    glow: "rgba(139,92,246,.30)",
  },
};

/**
 * Reusable Telemetry StatCard component.
 * Displays real-time metric value, trend visual, status pill, normal range, and mini statistics.
 */
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
  const resolvedStatusColor =
    STATUS_COLORS[String(status || "").toLowerCase()] || statusColor;
  const chartVariant = ["ppg", "line", "bars", "pressure"].includes(variant);

  return (
    <article className="flex min-w-0 flex-col rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
      {/* Icon */}
      <div
        className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
        style={{ background: style.bg }}
      >
        {icon}
      </div>

      {/* Title + Status */}
      <div className="mb-3 flex min-h-[22px] items-center justify-between gap-2">
        <span className="min-w-0 truncate text-[12px] font-medium tracking-[0.04em] text-[var(--color-text-secondary)]">
          {label}
        </span>

        {status && (
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{
              background: `${resolvedStatusColor}20`,
              color: resolvedStatusColor,
            }}
          >
            {status}
          </span>
        )}
      </div>

      {/* Current Value */}
      <div className="mb-5 flex min-h-[42px] items-baseline gap-1.5">
        <span className="text-[32px] font-bold leading-none tracking-[-0.035em] tabular-nums text-[var(--color-text)]">
          {value}
        </span>

        {unit && (
          <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">
            {unit}
          </span>
        )}
      </div>

      {/* Sensor Visual */}
      <div className={chartVariant ? "mb-2 h-[86px]" : "mb-2 h-[72px]"}>
        {variant === "ppg" && (
          <LineTrace
            color={style.color}
            samples={signal}
            sensorType="heart"
            emptyText="Waiting for pulse data..."
          />
        )}

        {variant === "line" && (
          <LineTrace color={style.color} samples={signal} />
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

      {/* Normal Range Indicator */}
      {normalRange && (
        <div className="mb-5 flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: "#20B486" }}
          />

          <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">
            {normalRange}
          </span>
        </div>
      )}

      {/* Min / Avg / Peak Summary */}
      <div className="mt-auto">
        <MiniStats items={miniStats} />
      </div>

      {/* Relative Updated Timestamp */}
      {updatedText && (
        <div className="mt-4 flex items-center gap-1.5 border-t border-[var(--color-border)] pt-3 text-[10px] font-medium text-[var(--color-text-muted)]">
          <Clock3 size={15} strokeWidth={1.7} />
          <span>Last seen {updatedText}</span>
        </div>
      )}
    </article>
  );
}
