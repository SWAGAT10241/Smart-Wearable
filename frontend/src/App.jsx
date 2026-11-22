import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { DeviceProvider } from "./context/DeviceContext";
import { LiveDataProvider } from "./context/LiveDataContext";

import ProtectedRoute from "./components/ProtectedRoute";
import FallAlertModal from "./components/FallAlertModal";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Dynamic route-based code splitting for minimal initial bundle size
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const OAuthSuccess = lazy(() => import("./pages/OAuthSuccess"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const History = lazy(() => import("./pages/History"));
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));
const Landing = lazy(() => import("./pages/Landing"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#070D1B]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        <span className="font-mono text-[11px] tracking-widest text-slate-500 dark:text-slate-400">
          INITIALIZING MODULE…
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <DeviceProvider>
            <LiveDataProvider>
              <BrowserRouter>
                <FallAlertModal />

                <Suspense fallback={<RouteLoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/oauth-success" element={<OAuthSuccess />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/about" element={<About />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </LiveDataProvider>
          </DeviceProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
