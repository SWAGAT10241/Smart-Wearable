import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLiveData } from '../context/LiveDataContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { connected } = useLiveData();

  return (
    <aside className="tg-sidebar">
      <div className="tg-sidebar__logo">
        <span className="tg-sidebar__logo-dot" />
        <span className="tg-sidebar__logo-text">TrailGuard</span>
      </div>

      <nav className="tg-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `tg-sidebar__item ${isActive ? 'tg-sidebar__item--active' : ''}`}
          >
            <span className="tg-sidebar__dot" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="tg-sidebar__logout" onClick={logout}>
        <span className="tg-sidebar__dot" />
        Log out
      </button>

      <div className="tg-sidebar__device">
        <div className="tg-sidebar__device-status">
          <span className={`tg-sidebar__status-dot ${connected ? 'is-connected' : ''}`} />
          {connected ? 'Device connected' : 'Reconnecting…'}
        </div>
        <div className="tg-sidebar__device-id">{user?.deviceId || 'No device paired'}</div>
      </div>
    </aside>
  );
}
