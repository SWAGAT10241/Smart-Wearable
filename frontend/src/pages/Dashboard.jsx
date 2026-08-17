import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { HeartIcon, DropletIcon, ThermometerIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { useLiveData } from '../context/LiveDataContext';
import { vitalsApi, environmentApi, locationApi, fallsApi } from '../lib/apiClient';
import './Dashboard.css';

function toMapSrc(lat, lng) {
  const delta = 0.01;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { vitals, environment, location } = useLiveData();
  const deviceId = user?.deviceId;

  // seed with REST data on mount / when the socket hasn't delivered a value yet;
  // WebSocket pushes (from LiveDataContext) take over from there.
  const [initialVitals, setInitialVitals] = useState(null);
  const [initialEnv, setInitialEnv] = useState(null);
  const [initialLoc, setInitialLoc] = useState(null);
  const [recentFalls, setRecentFalls] = useState([]);

  useEffect(() => {
    if (!deviceId) return;
    let cancelled = false;

    (async () => {
      const [vitalsRes, envRes, locRes, fallsRes] = await Promise.allSettled([
        vitalsApi.latest(deviceId),
        environmentApi.latest(deviceId),
        locationApi.latest(deviceId),
        fallsApi.all(deviceId),
      ]);

      if (cancelled) return;
      if (vitalsRes.status === 'fulfilled') setInitialVitals(vitalsRes.value);
      else console.error('Failed to load latest vitals', vitalsRes.reason);
      if (envRes.status === 'fulfilled') setInitialEnv(envRes.value);
      else console.error('Failed to load latest environment', envRes.reason);
      if (locRes.status === 'fulfilled') setInitialLoc(locRes.value);
      else console.error('Failed to load latest location', locRes.reason);
      if (fallsRes.status === 'fulfilled') setRecentFalls(fallsRes.value.slice(0, 3));
      else console.error('Failed to load fall events', fallsRes.reason);
    })();

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  const hr = vitals || initialVitals;
  const env = environment || initialEnv;
  const loc = location || initialLoc;
  const hasLocation = Number.isFinite(loc?.latitude) && Number.isFinite(loc?.longitude);
  const mapSrc = hasLocation ? toMapSrc(loc.latitude, loc.longitude) : '';
  const stats = [
    {
      icon: <HeartIcon color="#FF6B85" />,
      iconBg: '#FF3B5C',
      label: 'HEART RATE',
      value: hr?.heartRate ?? '--',
      unit: 'bpm',
      status: hr ? 'Normal' : undefined,
      statusColor: '#0E9C8C',
      variant: 'ecg',
      miniStats: [['Resting', '62'], ['Avg 1h', '76'], ['Peak', '142']],
    },
    {
      icon: <DropletIcon color="#5AACFF" />,
      iconBg: 'var(--color-o2)',
      label: 'BLOOD OXYGEN',
      value: hr?.spo2 ?? '--',
      unit: '% SpO2',
      status: hr ? 'Normal' : undefined,
      statusColor: '#0E9C8C',
      variant: 'gauge',
      gaugePct: hr?.spo2 ?? 97,
      miniStats: [['Min', '94%'], ['Avg 1h', '96%'], ['Max', '99%']],
    },
    {
      icon: <ThermometerIcon color="#FFB84D" />,
      iconBg: 'var(--color-temp)',
      label: 'TEMPERATURE',
      value: env?.temperature?.toFixed(1) ?? '--',
      unit: '°C',
      status: env ? 'Mild' : undefined,
      statusColor: 'var(--color-temp)',
      variant: 'tempGauge',
      gaugePct: 70,
      miniStats: [['Low', '14°'], ['Now', env?.temperature ? `${env.temperature.toFixed(1)}°` : '--'], ['High', '23°']],
    },
    {
      icon: <DropletIcon color="#5EEAD4" />,
      iconBg: 'var(--color-accent)',
      label: 'HUMIDITY',
      value: env?.humidity ?? '--',
      unit: '%',
      status: env ? 'Normal' : undefined,
      statusColor: 'var(--color-accent-dark)',
      miniStats: [['Low', '44%'], ['Avg 1h', '52%'], ['High', '61%']],
    },
  ];

  return (
    <div className="tg-page">
      <Sidebar />
      <main className="tg-dashboard">
        <div className="tg-dashboard__topbar">
          <div>
            <h1>Live Dashboard</h1>
            <span className="tg-dashboard__date">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              {user?.deviceId ? ` · ${user.deviceId}` : ''}
            </span>
          </div>
          <div className="tg-dashboard__user">
            <span className="tg-dashboard__avatar" />
            {user?.username}
          </div>
        </div>

        <div className="tg-dashboard__stats">
          {stats.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="tg-dashboard__lower">
          <div className="tg-mapcard">
            <div className="tg-mapcard__head">
              <h3>Live Location</h3>
              <span>{hasLocation ? 'Updated live' : 'Waiting for signal…'}</span>
            </div>
            <div className="tg-mapcard__area">
              {hasLocation ? (
                <iframe
                  className="tg-mapcard__frame"
                  title="Live location map"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="tg-mapcard__empty">Live map will appear once a GPS point arrives.</div>
              )}
              <div className="tg-mapcard__coords">
                {hasLocation ? `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}` : '--, --'}
              </div>
            </div>
          </div>

          <div className="tg-eventscard">
            <h3>Recent Events</h3>
            {recentFalls.length === 0 ? (
              <div className="tg-eventscard__row">
                <div className="tg-eventscard__title">No fall events today</div>
                <div className="tg-eventscard__tag" style={{ color: 'var(--color-accent-dark)' }}>All clear</div>
              </div>
            ) : (
              recentFalls.map((f) => (
                <div className="tg-eventscard__row" key={f._id}>
                  <div className="tg-eventscard__title">
                    {new Date(f.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    {' — '}
                    {f.severity} fall
                  </div>
                  <div className="tg-eventscard__tag">{f.status.replace(/_/g, ' ')}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
