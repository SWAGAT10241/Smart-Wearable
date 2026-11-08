import React from "react";
import { IoTimeOutline } from "react-icons/io5";
import useUpdatedTime from "../hooks/useUpdatedTime";
import MiniStats from "./common/MiniStats";
import { LineTrace, BarTrace, GaugeBar, TemperatureGauge } from "./charts";

/* =======================================================
 * Sensor Visual Styles (Bound to Semantic Design Tokens)
 * ======================================================= */
const STATUS_COLORS = {
  live: "var(--status-optimal)",
  normal: "var(--status-optimal)",
  mild: "var(--status-warning)",
  warning: "var(--status-warning)",
  alert: "var(--status-sos)",
};

const STYLES = {
  heart: {
    bg: "var(--surface-error)",
    color: "var(--action-destructive)",
  },
  oxygen: {
    bg: "var(--surface-accent)",
    color: "var(--status-optimal)",
  },
  temperature: {
    bg: "var(--surface-warning)",
    color: "var(--status-warning)",
  },
  humidity: {
    bg: "rgba(56, 189, 248, 0.12)",
    color: "var(--status-info)",
  },
  pressure: {
    bg: "rgba(56, 189, 248, 0.12)",
    color: "var(--status-info)",
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
  statusColor = "var(--status-optimal)",
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
    <article className="flex min-w-0 flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      {/* Icon */}
      <div
        className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
        style={{ background: style.bg }}
      >
        {icon}
      </div>

      {/* Title + Status */}
      <div className="mb-2 flex min-h-[22px] items-center justify-between gap-2">
        <span className="min-w-0 truncate text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {label}
        </span>

        {status && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
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
      <div className="mb-3 flex min-h-[38px] items-baseline gap-1.5">
        <span className="text-[28px] font-bold leading-none tracking-[-0.03em] tabular-nums text-[var(--color-text)]">
          {value}
        </span>

        {unit && (
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
            {unit}
          </span>
        )}
      </div>

      {/* Sensor Visual */}
      <div className={chartVariant ? "mb-2 h-[76px]" : "mb-2 h-[64px]"}>
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

        {variant === "plain" && <div className="h-[64px]" />}
      </div>

      {/* Normal Range Indicator */}
      {normalRange && (
        <div className="mb-3 flex items-center gap-1.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: "var(--status-optimal)" }}
          />

          <span className="truncate text-xs font-medium text-[var(--color-text-secondary)]">
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
        <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--color-border)] pt-2.5 text-xs font-medium text-[var(--color-text-secondary)]">
          <IoTimeOutline size={14} />
          <span>Last seen {updatedText}</span>
        </div>
      )}
    </article>
  );
}
