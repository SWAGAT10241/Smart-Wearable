import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLiveData } from '../context/LiveDataContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { connected } = useLiveData();

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-8 bg-slate-900 p-7 text-slate-200 shadow-[6px_0_24px_rgba(16,42,67,0.15)]">
      <div className="flex items-center gap-2.5">
        <span className="h-7 w-7 rounded-full bg-teal-400" />
        <span className="text-lg font-semibold text-white">TrailGuard</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${isActive
                ? 'bg-teal-400/20 font-semibold text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-teal-300' : 'bg-slate-400'}`}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button className="mt-auto flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:text-white" onClick={logout}>
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        Log out
      </button>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-teal-400' : 'bg-red-500'}`} />
          {connected ? 'Device connected' : 'Reconnecting…'}
        </div>
        <div className="mt-2 text-[11px] text-slate-400">{user?.deviceId || 'No device paired'}</div>
      </div>
    </aside>
  );
}
