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
  const displayStatus = status || (value !== "--" ? "Nominal" : "Standby");
  const resolvedStatusColor =
    STATUS_COLORS[String(displayStatus || "").toLowerCase()] || statusColor;

  return (
    <article className="flex h-full min-w-0 flex-col justify-between rounded-[var(--card-radius-compact)] border border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-sm p-[var(--card-padding-compact)] shadow-[var(--shadow-card)] transition-all hover:border-[var(--color-accent)]/30">
      <div>
        {/* Icon & Uniform Status Flag */}
        <div className="mb-[var(--space-3)] flex items-center justify-between gap-[var(--space-2)]">
          <div
            className={`flex h-[var(--dash-icon-box-size)] w-[var(--dash-icon-box-size)] shrink-0 items-center justify-center rounded-[var(--radius-lg)] ${
              iconType === "heart" && value !== "--" ? "animate-cardiac-pulse" : ""
            }`}
            style={{ background: style.bg }}
          >
            {icon}
          </div>

          {/* Uniform Tactical Status Flag Pill */}
          <span
            className="shrink-0 rounded-full px-[var(--dash-badge-padding-x)] py-[var(--dash-badge-padding-y)] text-[length:var(--dash-badge-text-size)] font-bold uppercase tracking-wider"
            style={{
              background: `${resolvedStatusColor}18`,
              borderColor: `${resolvedStatusColor}40`,
              color: resolvedStatusColor,
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full animate-pulse"
              style={{ background: resolvedStatusColor }}
            />
            <span>{displayStatus}</span>
          </span>
        </div>

        {/* Current Value with Flash Transition */}
        <div className="mb-[var(--space-3)] flex min-h-[var(--dash-card-value-min-height)] items-baseline gap-[var(--space-1-5)]">
          <span
            key={value}
            className="animate-telemetry-flash text-[var(--font-size-stat)] font-bold leading-none tracking-[-0.03em] tabular-nums text-[var(--color-text)]"
          >
            {value}
          </span>

          {unit && (
            <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
              {unit}
            </span>
          )}
        </div>

        {/* Uniform Sensor Visual (Identical 86px height across all 5 cards) */}
        <div className="mb-[var(--space-3)] flex h-[86px] w-full flex-col justify-center overflow-hidden">
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

          {variant === "plain" && <div className="h-[86px]" />}
        </div>

        {/* Normal Range Indicator */}
        {normalRange && (
          <div className="mb-[var(--space-3)] flex items-center gap-[var(--space-1-5)]">
            <span
              className="h-[var(--dash-range-dot-size)] w-[var(--dash-range-dot-size)] shrink-0 rounded-full"
              style={{ background: "var(--status-optimal)" }}
            />

            <span className="truncate text-xs font-medium text-[var(--color-text-secondary)]">
              {normalRange}
            </span>
          </div>
        )}
      </div>

      <div>
        {/* Min / Avg / Peak Summary */}
        <div className="mt-auto">
          <MiniStats items={miniStats} />
        </div>

        {/* Relative Updated Timestamp */}
        {updatedText && (
          <div className="mt-[var(--space-3)] flex items-center gap-[var(--space-1-5)] border-t border-[var(--color-border)] pt-[var(--space-2-5)] text-xs font-medium text-[var(--color-text-secondary)]">
            <IoTimeOutline className="text-[var(--font-size-sm)]" />
            <span>Last seen {updatedText}</span>
          </div>
        )}
      </div>
    </article>
  );
}
