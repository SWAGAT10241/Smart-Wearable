import React from "react";

/**
 * Line trace chart component for continuous sensors (Heart Rate, Atmospheric Pressure).
 * Renders smooth SVG polyline with dynamic scaling and min/max guide lines.
 */
export default function LineTrace({
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
            if (Number.isFinite(Number(item.value))) return Number(item.value);

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
      <div className="flex h-[86px] items-center justify-center text-[10px] font-medium text-[var(--color-text-muted)]">
        {emptyText}
      </div>
    );
  }

  const settings = {
    heart: { minimumRange: 20, rounding: 0 },
    pressure: { minimumRange: 6, rounding: 1 },
    generic: { minimumRange: 10, rounding: 1 },
  };

  const config = settings[sensorType] || settings.generic;

  const dataMin = Math.min(...visibleValues);
  const dataMax = Math.max(...visibleValues);
  const dataRange = dataMax - dataMin;
  const effectiveRange = Math.max(dataRange, config.minimumRange);
  const padding = effectiveRange * 0.15;

  let chartMin = dataMin - padding;
  let chartMax = dataMax + padding;

  if (dataRange < config.minimumRange) {
    const center = (dataMin + dataMax) / 2;
    chartMin = center - effectiveRange / 2;
    chartMax = center + effectiveRange / 2;
  }

  const factor = 10 ** config.rounding;
  chartMin = Math.floor(chartMin * factor) / factor;
  chartMax = Math.ceil(chartMax * factor) / factor;

  if (chartMax <= chartMin) {
    chartMax = chartMin + config.minimumRange;
  }

  const range = chartMax - chartMin;
  const width = 300;
  const height = 86;

  const formatLabel = (val) =>
    config.rounding === 0
      ? Math.round(val)
      : Number(val.toFixed(config.rounding));

  const labels = [
    formatLabel(chartMax),
    formatLabel(chartMin + range / 2),
    formatLabel(chartMin),
  ];

  const points = visibleValues
    .map((val, index) => {
      const x = 4 + (index / (visibleValues.length - 1)) * (width - 8);
      const safeValue = Math.min(Math.max(val, chartMin), chartMax);
      const y = 6 + ((chartMax - safeValue) / range) * (height - 12);
      return `${x},${y}`;
    })
    .join(" ");

  const lastValue = visibleValues[visibleValues.length - 1];
  const lastX = width - 4;
  const safeLastValue = Math.min(Math.max(lastValue, chartMin), chartMax);
  const lastY = 6 + ((chartMax - safeLastValue) / range) * (height - 12);

  return (
    <div className="grid h-[86px] grid-cols-[34px_minmax(0,1fr)] gap-2">
      <div className="flex h-full flex-col justify-between py-[1px]">
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="text-[9px] font-medium leading-none tabular-nums text-[var(--color-text-muted)]"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="relative min-w-0 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          {[0, 1, 2].map((index) => {
            const y = 6 + (index / 2) * (height - 12);
            return (
              <line
                key={index}
                x1="0"
                x2={width}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            );
          })}

          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
        </svg>
      </div>
    </div>
  );
}

