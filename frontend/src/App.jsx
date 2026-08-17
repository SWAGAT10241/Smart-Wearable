import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LiveDataProvider } from './context/LiveDataContext';
import ProtectedRoute from './components/ProtectedRoute';
import FallAlertModal from './components/FallAlertModal';

import Login from './pages/Login';
import Register from './pages/Register';
import OAuthSuccess from './pages/OAuthSuccess';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <LiveDataProvider>
        <BrowserRouter>
          {/* Fall/SOS alert is global — per design.md §4.6 it must interrupt
              whatever page the user is on the instant a fall_detected event
              arrives over the WebSocket, not just on the Dashboard. */}
          <FallAlertModal />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </LiveDataProvider>
    </AuthProvider>
  );
}
