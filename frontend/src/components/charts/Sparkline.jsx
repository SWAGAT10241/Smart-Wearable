export function Sparkline({ data = [], color = "#10b981", height = 40, width = 120 }) {
  if (!data || data.length < 2) {
    return <div style={{ height, width }} className="flex items-center justify-center text-xs text-slate-600">—</div>;
  }

  const values = data.map((d) => (typeof d === "number" ? d : d.value ?? 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((val, idx) => {
      const x = (idx / (values.length - 1)) * (width - 4) + 2;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default Sparkline;
