function MiniStats({ items }) {
  return (
    <div className="flex items-center gap-2">
      {items.map(([label, value], i) => (
        <div className="flex items-center gap-2" key={label}>
          {i > 0 && <div className="h-[18px] w-px bg-slate-200" />}
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-semibold text-slate-800">{value}</span>
            <span className="text-[9px] text-slate-400">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function EcgTrace({ color = '#FF6B85' }) {
  return (
    <div className="relative h-[34px]">
      <svg viewBox="0 0 200 34" width="100%" height="34" preserveAspectRatio="none">
        <polyline
          points="0,20 26,20 32,8 38,30 44,14 50,20 76,20 82,8 88,30 94,14 100,20 126,20 132,8 138,30 144,14 150,20 200,20"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}aa)` }}
        />
      </svg>
      <span className="absolute left-[33px] top-[12px] h-[7px] w-[7px] rounded-full" style={{ background: color, boxShadow: `0 0 0 8px ${color}22` }} />
    </div>
  );
}

function GaugeBar({ pct, color = 'var(--color-o2)', gradient }) {
  return (
    <div className="relative h-5">
      <div
        className="absolute left-0 right-0 top-[7px] h-[6px] rounded-full"
        style={gradient ? { background: gradient } : { background: `${color}22` }}
      />
      {!gradient && (
        <div className="absolute left-0 top-[7px] h-[6px] rounded-full" style={{ width: `${pct}%`, background: color }} />
      )}
      <div className="absolute top-[4px] h-3 w-3 rounded-full bg-white" style={{ left: `calc(${pct}% - 6px)`, border: `2.5px solid ${color}` }} />
    </div>
  );
}

/**
 * variant: 'ecg' | 'gauge' | 'tempGauge' | 'plain'
 * miniStats: [[label, value], ...] — rendered under the visual, packs extra info in the same footprint
 */
export default function StatCard({ icon, iconBg, label, value, unit, status, statusColor, variant = 'plain', gaugePct, miniStats }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-[26px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-[13px]" style={{ background: `${iconBg}29` }}>
        {icon}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-medium tracking-[0.02em] text-slate-500">{label}</span>
        {status && (
          <span className="rounded-full px-2 py-1 text-[10px] font-semibold" style={{ background: `${statusColor}26`, color: statusColor }}>
            {status}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[30px] font-bold leading-none tabular-nums text-slate-900">{value}</span>
        <span className="text-[13px] text-slate-500">{unit}</span>
      </div>

      {variant === 'ecg' && <EcgTrace color={iconBg} />}
      {variant === 'gauge' && <GaugeBar pct={gaugePct} color={iconBg} />}
      {variant === 'tempGauge' && (
        <GaugeBar
          pct={gaugePct}
          gradient="linear-gradient(90deg, var(--color-secondary), var(--color-accent), var(--color-temp))"
          color="var(--color-temp)"
        />
      )}

      {miniStats && <MiniStats items={miniStats} />}
    </div>
  );
}
