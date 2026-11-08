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
 * Telemetry StatCard adhering to the global design & typography system.
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
    <article className="tg-card group hover:border-[var(--color-accent)]/50 hover:shadow-md">
      {/* Top Accent Stroke */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${style.color}, transparent 65%)` }}
      />

      {/* Header Deck: Icon + Label + Status */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/5 dark:border-white/10 text-xs shadow-2xs"
            style={{ background: style.bg }}
          >
            {icon}
          </div>

          <span className="tg-metric-label truncate">
            {label}
          </span>
        </div>

        {status && (
          <span
            className="tg-badge"
            style={{
              background: `${resolvedStatusColor}14`,
              borderColor: `${resolvedStatusColor}35`,
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

      {/* Primary Value Readout */}
      <div className="mb-2 flex items-baseline gap-1.5">
        <span className="tg-metric-value">
          {value}
        </span>

        {unit && (
          <span className="tg-metric-unit">
            {unit}
          </span>
        )}
      </div>

      {/* Sensor Viewport Screen */}
      <div
        className={`mb-2.5 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]/60 px-2 py-1.5 shadow-2xs ${
          chartVariant ? "h-[84px]" : "h-[74px]"
        }`}
      >
        {variant === "ppg" && (
          <LineTrace
            color={style.color}
            samples={signal}
            sensorType="heart"
            emptyText="Waiting for pulse..."
          />
        )}

        {variant === "line" && (
          <LineTrace color={style.color} samples={signal} />
        )}

        {variant === "bars" && (
          <BarTrace
            color={style.color}
            samples={signal}
            emptyText="Waiting for humidity..."
          />
        )}

        {variant === "gauge" && <GaugeBar pct={gaugePct} color={style.color} />}
        {variant === "tempGauge" && <TemperatureGauge temperature={value} />}
        {variant === "pressure" && (
          <LineTrace
            color={style.color}
            samples={signal}
            sensorType="pressure"
            emptyText="Waiting for pressure..."
          />
        )}

        {variant === "plain" && <div className="h-[60px]" />}
      </div>

      {/* Normal Range Reference */}
      {normalRange && (
        <div className="mb-2 flex items-center gap-1.5 text-xs">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: "var(--status-optimal)" }}
          />
          <span className="truncate text-xs text-[var(--color-text-secondary)]">
            {normalRange.replace(/Normal Range: |Comfort Range: /, "")}
          </span>
        </div>
      )}

      {/* Statistical Summary */}
      <div className="mt-auto">
        <MiniStats items={miniStats} />
      </div>

      {/* Timestamp Footer */}
      {updatedText && (
        <div className="mt-2.5 flex items-center gap-1.5 border-t border-[var(--color-border)] pt-2 text-[11px] text-[var(--color-text-muted)]">
          <IoTimeOutline size={12} className="shrink-0" />
          <span className="truncate">Updated {updatedText}</span>
        </div>
      )}
    </article>
  );
}
