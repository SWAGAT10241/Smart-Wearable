import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveToken } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { isProfileComplete } from '../lib/profileCompletion';

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center">
      <div className="relative h-[72px] w-[72px]">
        <svg width="72" height="72" viewBox="0 0 72 72" className="animate-spin [animation-duration:1s]" style={{ transformOrigin: '50% 50%' }}>
          <circle cx="36" cy="36" r="33" fill="none" stroke="#D9E4E8" strokeWidth="5" />
          <circle
            cx="36" cy="36" r="33" fill="none"
            stroke="#2DD4BF" strokeWidth="5" strokeLinecap="round"
            strokeDasharray="207" strokeDashoffset="90"
            style={{ filter: 'drop-shadow(0 0 6px rgba(45, 212, 191, 0.5))' }}
          />
        </svg>
        <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900" />
      </div>
      <h1 className="m-0 text-[22px] font-semibold text-slate-900">Signing you in…</h1>
      <p className="m-0 text-sm text-slate-600">Confirming your Google account with TrailGuard.</p>
      <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium text-slate-500">Redirecting to your dashboard…</div>
    </div>
  );
}
