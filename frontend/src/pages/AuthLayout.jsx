import './AuthLayout.css';

const FEATURES = [
  ['❤', 'Real-time heart rate & SpO2', 'Continuous monitoring of your vitals.'],
  ['⚡', 'Automatic fall detection', 'Instant alerts when it matters most.'],
  ['◎', 'Live GPS trail tracking', 'Share your location in real time.'],
  ['🔔', 'Instant emergency contact alerts', 'We notify your loved ones instantly.'],
];

// Matches the Login/Register split layout in the Figma file: a Main-navy
// brand panel on the left, form content on the right.
export default function AuthLayout({ headline, children }) {
  return (
    <div className="tg-authlayout">
      <div className="tg-authlayout__brand">
        <div className="tg-authlayout__logo">
          <span className="tg-authlayout__logo-dot">🛡</span>
          <span>
            Trail<span className="tg-authlayout__logo-accent">Guard</span>
          </span>
        </div>
        <h1 className="tg-authlayout__headline">{headline}</h1>
        <p className="tg-authlayout__sub">
          Live vitals, fall detection, and GPS tracking for hikers — with instant alerts to the people who matter.
        </p>
        <ul className="tg-authlayout__features">
          {FEATURES.map(([icon, title, sub]) => (
            <li key={title}>
              <span className="tg-authlayout__feature-icon">{icon}</span>
              <div>
                <div className="tg-authlayout__feature-title">{title}</div>
                <div className="tg-authlayout__feature-sub">{sub}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="tg-authlayout__footer">
          <span>TrailGuard secures your adventures.</span>
          <span className="tg-authlayout__footer-sep">|</span>
          <span>Stay safe. Explore more.</span>
        </div>
      </div>
      <div className="tg-authlayout__form">{children}</div>
    </div>
  );
}
