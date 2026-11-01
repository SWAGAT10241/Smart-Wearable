export default function Sparkline({ points, color = "#14b8a6" }) {
  const values = Array.isArray(points)
    ? points.map(Number).filter(Number.isFinite)
    : [];

  if (values.length < 2) {
    return (
      <div className="flex h-[140px] items-center justify-center text-sm text-[var(--color-text-muted)]">
        Not enough data yet
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  const width = 560;
  const height = 140;
  const padding = 12;

  const range = max - min || 1;

  const pointsString = values
    .map((value, index) => {
      const x = padding + (index / (values.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (value - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <path
        d={pointsString}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
