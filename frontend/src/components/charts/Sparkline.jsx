import { useId } from "react";

export default function Sparkline({
  points = [],
  color = "var(--action-primary)",
  unit = "",
  sensorType = "generic",
}) {
  const reactId = useId();
  const gradientId = `sparkline-grad-${sensorType}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

  const values = Array.isArray(points)
    ? points.map(Number).filter(Number.isFinite)
    : [];

  if (values.length < 2) {
    return (
      <div className="flex h-[130px] items-center justify-center font-mono text-xs text-[var(--color-text-muted)]">
        Waiting for telemetry samples...
      </div>
    );
  }

  // Domain configurations per sensor to ensure logical scale baselines
  const sensorConfigs = {
    heart: { minRange: 30, decimals: 0 },
    oxygen: { minRange: 8, decimals: 0 },
    temperature: { minRange: 6, decimals: 1 },
    humidity: { minRange: 20, decimals: 0 },
    pressure: { minRange: 15, decimals: 0 },
    generic: { minRange: 10, decimals: 1 },
  };

  const config = sensorConfigs[sensorType] || sensorConfigs.generic;

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const rawRange = dataMax - dataMin;
  const effectiveRange = Math.max(rawRange, config.minRange || 10);
  const padding = effectiveRange * 0.12;

  let scaleMin = dataMin - padding;
  let scaleMax = dataMax + padding;

  if (rawRange < (config.minRange || 10)) {
    const center = (dataMin + dataMax) / 2;
    scaleMin = center - effectiveRange / 2;
    scaleMax = center + effectiveRange / 2;
  }

  // Constrain SpO2 scale logically to max 100%
  if (sensorType === "oxygen" && scaleMax > 100) {
    scaleMax = 100;
  }

  const factor = 10 ** config.decimals;
  scaleMin = Math.floor(scaleMin * factor) / factor;
  scaleMax = Math.ceil(scaleMax * factor) / factor;

  if (scaleMax <= scaleMin) {
    scaleMax = scaleMin + (config.minRange || 10);
  }

  const scaleMid = Number(((scaleMax + scaleMin) / 2).toFixed(config.decimals));
  const range = scaleMax - scaleMin;

  const width = 500;
  const height = 126;
  const chartPadLeft = 4;
  const chartPadRight = 6;
  const chartWidth = width - chartPadLeft - chartPadRight;

  const formatScaleLabel = (num) =>
    config.decimals === 0 ? Math.round(num) : num.toFixed(config.decimals);

  const scaleLabels = [
    { label: `${formatScaleLabel(scaleMax)}`, yPct: 0 },
    { label: `${formatScaleLabel(scaleMid)}`, yPct: 50 },
    { label: `${formatScaleLabel(scaleMin)}`, yPct: 100 },
  ];

  // Derive SVG polyline coordinates
  const pointsCoords = values.map((val, idx) => {
    const x = chartPadLeft + (idx / (values.length - 1)) * chartWidth;
    const safeVal = Math.min(Math.max(val, scaleMin), scaleMax);
    const y = 8 + ((scaleMax - safeVal) / range) * (height - 16);
    return { x, y, val };
  });

  const pathD = pointsCoords
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // Gradient area fill underneath path
  const areaD = `${pathD} L ${pointsCoords[pointsCoords.length - 1].x.toFixed(1)} ${height} L ${pointsCoords[0].x.toFixed(1)} ${height} Z`;

  const lastPoint = pointsCoords[pointsCoords.length - 1];

  return (
    <div className="grid h-[130px] grid-cols-[46px_minmax(0,1fr)] gap-2">
      {/* Y-AXIS SCALE LABELS */}
      <div className="flex h-full select-none flex-col justify-between py-1 text-right font-mono">
        {scaleLabels.map(({ label, yPct }) => (
          <div key={yPct} className="flex items-center justify-end gap-1">
            <span className="text-[10px] font-semibold tabular-nums text-[var(--color-text-secondary)]">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* SVG CHART CANVAS WITH HORIZONTAL GRID LINES */}
      <div className="relative min-w-0 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* DOTTED HORIZONTAL GRID GUIDE LINES */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = 8 + pct * (height - 16);
            return (
              <line
                key={idx}
                x1="0"
                x2={width}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.8"
              />
            );
          })}

          {/* TRANSLUCENT COLORED AREA FILL (SANITIZED ID PREVENTS BLACK FALLBACK) */}
          <path d={areaD} fill={`url(#${gradientId})`} />

          {/* DYNAMIC LINE TRACE */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* LIVE ENDPOINT DOT */}
          {lastPoint && (
            <>
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="4.5"
                fill={color}
                opacity="0.3"
              />
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="2.5"
                fill={color}
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
