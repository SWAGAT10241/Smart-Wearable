import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveToken } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { isProfileComplete } from '../lib/profileCompletion';
import './OAuthSuccess.css';

// Handles the redirect from GET /api/auth/google/callback, which sends the
// browser to `${CLIENT_URL}/oauth-success?token=...` (plus metadata query
// params, depending on backend implementation).
export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    saveToken(token);
    refreshUser().then((nextUser) => {
      navigate(isProfileComplete(nextUser) ? '/dashboard' : '/complete-profile', { replace: true });
    }).catch(() => {
      navigate('/login', { replace: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tg-oauth">
      <div className="tg-oauth__spinner">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="33" fill="none" stroke="var(--color-border)" strokeWidth="5" />
          <circle
            cx="36" cy="36" r="33" fill="none"
            stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round"
            strokeDasharray="207" strokeDashoffset="90"
            className="tg-oauth__arc"
          />
        </svg>
        <span className="tg-oauth__logo-dot" />
      </div>
      <h1>Signing you in…</h1>
      <p>Confirming your Google account with TrailGuard.</p>
      <div className="tg-oauth__pill">Redirecting to your dashboard…</div>
    </div>
  );
}
