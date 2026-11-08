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
 * Minimalist high-density tactical StatCard.
 * Optimized for both light and dark modes with high data density,
 * tactile hairline borders, corner coordinates/ticks, and monospace readouts.
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
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs transition-all duration-200 hover:border-[var(--color-accent)]/50 hover:shadow-md">
      {/* Tactical Top Accent Indicator */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${style.color}, transparent 60%)` }}
      />

      {/* Subtle Tactical Corner Crosshairs */}
      <span className="pointer-events-none absolute top-1.5 right-2 font-mono text-[8px] text-[var(--color-text-muted)] select-none opacity-30">
        +
      </span>
      <span className="pointer-events-none absolute bottom-1.5 left-2 font-mono text-[8px] text-[var(--color-text-muted)] select-none opacity-30">
        +
      </span>

      {/* Header Deck: Icon + Label + Tactical Status */}
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/5 dark:border-white/10 text-xs shadow-2xs"
            style={{ background: style.bg }}
          >
            {icon}
          </div>

          <span className="truncate font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {label}
          </span>
        </div>

        {status && (
          <span
            className="flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border"
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

      {/* Primary Metric Readout */}
      <div className="mb-2.5 flex items-baseline gap-1.5 font-mono">
        <span className="text-[26px] font-black leading-none tracking-tight tabular-nums text-[var(--color-text)]">
          {value}
        </span>

        {unit && (
          <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">
            {unit}
          </span>
        )}
      </div>

      {/* High-density Sensor Viewport Screen */}
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
        <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px]">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: "var(--status-optimal)" }}
          />
          <span className="truncate font-medium text-[var(--color-text-secondary)]">
            {normalRange}
          </span>
        </div>
      )}

      {/* Statistical Summary (Min / Avg / Peak) */}
      <div className="mt-auto">
        <MiniStats items={miniStats} />
      </div>

      {/* Tactical Timestamp Footer */}
      {updatedText && (
        <div className="mt-2.5 flex items-center gap-1.5 border-t border-[var(--color-border)] pt-2 font-mono text-[10px] text-[var(--color-text-muted)]">
          <IoTimeOutline size={12} className="shrink-0" />
          <span className="truncate">SYNCED: {updatedText}</span>
        </div>
      )}
    </article>
  );
}
