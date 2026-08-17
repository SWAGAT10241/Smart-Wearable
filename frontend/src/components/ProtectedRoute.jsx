import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isProfileComplete } from '../lib/profileCompletion';

// Dashboard access requires a complete safety profile; this is validated from
// either backend profileComplete or the required contact/safety fields.
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="tg-loading-screen">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isProfileComplete(user)) return <Navigate to="/complete-profile" replace />;

  return <Outlet />;
}
