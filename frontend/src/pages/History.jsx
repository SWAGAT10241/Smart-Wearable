import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { vitalsApi, environmentApi, locationApi, fallsApi } from '../lib/apiClient';
import './History.css';

const RANGES = [
  { label: '1h', hours: 1 },
  { label: '6h', hours: 6 },
  { label: '24h', hours: 24 },
];

function Sparkline({ points, color }) {
  if (!points || points.length < 2) {
    return <div className="tg-chart__empty">Not enough data yet</div>;
  }
  const min = Math.min(...points);
  const max = Math.max(...points) || 1;
  const norm = (v) => 1 - (v - min) / (max - min || 1);
  const w = 560, h = 120, pad = 10;
  const step = (w - pad * 2) / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${pad + norm(p) * (h - pad * 2)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function History() {
  const { user } = useAuth();
  const deviceId = user?.deviceId;
  const [range, setRange] = useState(24);
  const [vitals, setVitals] = useState([]);
  const [env, setEnv] = useState([]);
  const [trail, setTrail] = useState([]);
  const [falls, setFalls] = useState([]);

  useEffect(() => {
    if (!deviceId) return;
    vitalsApi.history(deviceId, range).then(setVitals).catch(() => setVitals([]));
    environmentApi.history(deviceId, range).then(setEnv).catch(() => setEnv([]));
    locationApi.history(deviceId, range).then(setTrail).catch(() => setTrail([]));
    fallsApi.all(deviceId).then(setFalls).catch(() => setFalls([]));
  }, [deviceId, range]);

  const hrPoints = vitals.map((v) => v.heartRate);
  const spo2Points = vitals.map((v) => v.spo2);
  const tempPoints = env.map((e) => e.temperature);
  const humidityPoints = env.map((e) => e.humidity);

  // trail path, normalized into an SVG-friendly 0..1 box
  const trailPath = (() => {
    if (trail.length < 2) return null;
    const lats = trail.map((t) => t.latitude);
    const lngs = trail.map((t) => t.longitude);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const w = 560, h = 220, pad = 20;
    const nx = (lng) => pad + ((lng - minLng) / (maxLng - minLng || 1)) * (w - pad * 2);
    const ny = (lat) => h - pad - ((lat - minLat) / (maxLat - minLat || 1)) * (h - pad * 2);
    return trail.map((t, i) => `${i === 0 ? 'M' : 'L'} ${nx(t.longitude)} ${ny(t.latitude)}`).join(' ');
  })();

  return (
    <div className="tg-page">
      <Sidebar />
      <main className="tg-history">
        <div className="tg-history__topbar">
          <h1>History &amp; Trends</h1>
          <div className="tg-history__ranges">
            {RANGES.map((r) => (
              <button
                key={r.label}
                className={`tg-history__chip ${range === r.hours ? 'is-active' : ''}`}
                onClick={() => setRange(r.hours)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tg-chart">
          <h3>Heart Rate (bpm)</h3>
          <div className="tg-chart__area"><Sparkline points={hrPoints} color="#FF6B85" /></div>
        </div>
        <div className="tg-chart">
          <h3>Blood Oxygen (SpO2 %)</h3>
          <div className="tg-chart__area"><Sparkline points={spo2Points} color="var(--color-secondary)" /></div>
        </div>
        <div className="tg-chart">
          <h3>Temperature (°C)</h3>
          <div className="tg-chart__area"><Sparkline points={tempPoints} color="var(--color-temp)" /></div>
        </div>
        <div className="tg-chart">
          <h3>Humidity (%)</h3>
          <div className="tg-chart__area"><Sparkline points={humidityPoints} color="var(--color-accent)" /></div>
        </div>

        <div className="tg-chart">
          <h3>Trail Path</h3>
          <div className="tg-chart__area tg-chart__area--map">
            {trailPath ? (
              <svg viewBox="0 0 560 220" width="100%" height="220" preserveAspectRatio="none">
                <path d={trailPath} fill="none" stroke="#0E9C8C" strokeWidth="2.5" strokeDasharray="7 5" strokeLinecap="round" />
              </svg>
            ) : (
              <div className="tg-chart__empty">No location history for this range</div>
            )}
          </div>
        </div>

        <div className="tg-fallslog">
          <h3>Fall Event Log</h3>
          <div className="tg-fallslog__row tg-fallslog__row--head">
            <span>Time</span><span>Severity</span><span>Status</span><span>Location</span>
          </div>
          {falls.length === 0 && <div className="tg-fallslog__empty">No fall events recorded.</div>}
          {falls.map((f) => (
            <div className="tg-fallslog__row" key={f._id}>
              <span>{new Date(f.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
              <span style={{ textTransform: 'capitalize' }}>{f.severity}</span>
              <span style={{ textTransform: 'capitalize' }}>{f.status.replace(/_/g, ' ')}</span>
              <span>{f.latitude?.toFixed(2)}, {f.longitude?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
