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
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-border-hover,rgba(255,255,255,0.24))] hover:shadow-2xl">
      {/* Top subtle highlight rim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Top neon indicator line */}
      <div
        className="pointer-events-none absolute top-0 left-6 right-6 h-[2px] rounded-full transition-all duration-500 group-hover:left-3 group-hover:right-3 opacity-60 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${style.color}, transparent)` }}
      />

      {/* Subtle ambient aura glow matching metric identity */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: style.color }}
      />

      {/* Icon */}
      <div
        className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/10 shadow-xs transition-transform duration-300 group-hover:scale-105"
        style={{ background: style.bg }}
      >
        {icon}
      </div>

      {/* Title + Status */}
      <div className="mb-2 flex min-h-[22px] items-center justify-between gap-2">
        <span className="min-w-0 truncate text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)] font-mono">
          {label}
        </span>

        {status && (
          <span
            className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border shadow-xs"
            style={{
              background: `${resolvedStatusColor}18`,
              borderColor: `${resolvedStatusColor}40`,
              color: resolvedStatusColor,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: resolvedStatusColor }}
            />
            {status}
          </span>
        )}
      </div>

      {/* Current Value */}
      <div className="mb-3 flex min-h-[38px] items-baseline gap-1.5">
        <span className="text-[32px] font-black leading-none tracking-[-0.03em] tabular-nums text-[var(--color-text)]">
          {value}
        </span>

        {unit && (
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {unit}
          </span>
        )}
      </div>

      {/* Sensor Visual Viewport */}
      <div className={`mb-2.5 rounded-[18px] border border-white/[0.04] bg-black/[0.03] dark:bg-black/25 px-2 py-1.5 shadow-inner ${chartVariant ? "h-[94px]" : "h-[80px]"}`}>
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
