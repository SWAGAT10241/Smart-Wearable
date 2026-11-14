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
  const isBaseline = visibleValues.length < 2;
  const singleVal = visibleValues.length === 1 ? visibleValues[0] : null;

  const baselineData = {
    heart: singleVal != null
      ? [singleVal - 2, singleVal, singleVal + 4, singleVal - 1, singleVal + 3, singleVal, singleVal - 2, singleVal]
      : [68, 70, 72, 71, 75, 74, 70, 72, 71, 73],
    pressure: singleVal != null
      ? [singleVal - 0.2, singleVal, singleVal + 0.3, singleVal - 0.1, singleVal + 0.2, singleVal]
      : [1012.8, 1013.1, 1013.4, 1013.0, 1013.3, 1013.1],
    generic: singleVal != null
      ? [singleVal, singleVal + 1, singleVal - 1, singleVal + 2, singleVal]
      : [50, 52, 51, 54, 53, 50],
  };

  const chartValues = isBaseline
    ? (baselineData[sensorType] || baselineData.generic)
    : visibleValues;

  const settings = {
    heart: { minimumRange: 20, rounding: 0 },
    pressure: { minimumRange: 6, rounding: 1 },
    generic: { minimumRange: 10, rounding: 1 },
  };

  const config = settings[sensorType] || settings.generic;

  const dataMin = Math.min(...chartValues);
  const dataMax = Math.max(...chartValues);
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

  const points = chartValues
    .map((val, index) => {
      const x = 4 + (index / (chartValues.length - 1)) * (width - 8);
      const safeValue = Math.min(Math.max(val, chartMin), chartMax);
      const y = 6 + ((chartMax - safeValue) / range) * (height - 12);
      return `${x},${y}`;
    })
    .join(" ");

  const lastValue = chartValues[chartValues.length - 1];
  const lastX = width - 4;
  const safeLastValue = Math.min(Math.max(lastValue, chartMin), chartMax);
  const lastY = 6 + ((chartMax - safeLastValue) / range) * (height - 12);

  return (
    <div className="relative grid h-[86px] grid-cols-[34px_minmax(0,1fr)] gap-2">
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
            strokeWidth={isBaseline ? "1.8" : "2"}
            strokeDasharray={isBaseline ? "4 3" : undefined}
            opacity={isBaseline ? 0.6 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx={lastX}
            cy={lastY}
            r="2.5"
            fill={color}
            opacity={isBaseline ? 0.7 : 1}
          />
        </svg>

        {isBaseline && (
          <span className="absolute right-1.5 top-1 rounded bg-[var(--color-surface)]/80 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] backdrop-blur-sm">
            Standby
          </span>
        )}
      </div>
    </div>
  );
}

