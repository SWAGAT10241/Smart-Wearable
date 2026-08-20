import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { HeartIcon, DropletIcon, ThermometerIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { useLiveData } from '../context/LiveDataContext';
import { vitalsApi, environmentApi, locationApi, fallsApi } from '../lib/apiClient';

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
      <main className="flex flex-1 flex-col gap-6 bg-slate-50 p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200/80">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">Live Dashboard</h1>
            <span className="text-sm text-slate-500">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              {user?.deviceId ? ` · ${user.deviceId}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
            <span className="h-8 w-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,#a7f3d0,#0f766e)]" />
            {user?.username}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {stats.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_minmax(280px,0.8fr)]">
          <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center justify-between text-sm">
              <h3 className="text-lg font-semibold text-slate-900">Live Location</h3>
              <span className="text-slate-500">{hasLocation ? 'Updated live' : 'Waiting for signal…'}</span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {hasLocation ? (
                <iframe
                  className="h-[260px] w-full border-0"
                  title="Live location map"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center px-6 text-center text-sm text-slate-500">Live map will appear once a GPS point arrives.</div>
              )}
              <div className="border-t border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
                {hasLocation ? `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}` : '--, --'}
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Events</h3>
            {recentFalls.length === 0 ? (
              <div className="flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 px-3 py-3 text-sm">
                <div className="text-slate-700">No fall events today</div>
                <div className="font-medium text-teal-700">All clear</div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFalls.map((f) => (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" key={f._id}>
                    <div className="font-medium text-slate-700">
                      {new Date(f.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      {' — '}
                      {f.severity} fall
                    </div>
                    <div className="mt-2 inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-700">
                      {f.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
