import './StatCard.css';

function MiniStats({ items }) {
  return (
    <div className="tg-ministats">
      {items.map(([label, value], i) => (
        <div className="tg-ministats__item" key={label}>
          {i > 0 && <div className="tg-ministats__divider" />}
          <div className="tg-ministats__col">
            <span className="tg-ministats__value">{value}</span>
            <span className="tg-ministats__label">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function EcgTrace({ color = '#FF6B85' }) {
  return (
    <div className="tg-ecg">
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
      <span className="tg-ecg__beat" style={{ background: color, boxShadow: `0 0 0 8px ${color}22` }} />
    </div>
  );
}

function GaugeBar({ pct, color = 'var(--color-o2)', gradient }) {
  return (
    <div className="tg-gauge">
      <div
        className="tg-gauge__track"
        style={gradient ? { background: gradient } : { background: `${color}22` }}
      />
      {!gradient && (
        <div className="tg-gauge__fill" style={{ width: `${pct}%`, background: color }} />
      )}
      <div className="tg-gauge__thumb" style={{ left: `calc(${pct}% - 6px)`, borderColor: color }} />
    </div>
  );
}

/**
 * variant: 'ecg' | 'gauge' | 'tempGauge' | 'plain'
 * miniStats: [[label, value], ...] — rendered under the visual, packs extra info in the same footprint
 */
export default function StatCard({ icon, iconBg, label, value, unit, status, statusColor, variant = 'plain', gaugePct, miniStats }) {
  return (
    <div className="tg-statcard">
      <div className="tg-statcard__icon" style={{ background: `${iconBg}29` }}>
        {icon}
      </div>
      <div className="tg-statcard__head">
        <span className="tg-statcard__label">{label}</span>
        {status && (
          <span className="tg-statcard__badge" style={{ background: `${statusColor}26`, color: statusColor }}>
            {status}
          </span>
        )}
      </div>
      <div className="tg-statcard__value">
        <span className="tg-statcard__number">{value}</span>
        <span className="tg-statcard__unit">{unit}</span>
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
