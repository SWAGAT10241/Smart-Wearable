import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Navigation, ArrowLeft, Home, Search, Radio, CornerDownLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import loginBackground from "../assets/images/login-background.png";

const TYPEWRITER_PHRASES = [
  "Searching GPS constellation... 0 satellites responding.",
  "Warning: Out of designated geo-fence bounds.",
  "Coordinates invalid: Waymark 404 does not exist on trail.",
  "Telemetry signal lost on this route.",
];

export default function NotFound() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Typewriter effect state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTarget, setSearchTarget] = useState("");

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 30 : 50;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2400);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    const clean = searchTarget.trim().toLowerCase();
    if (!clean) return;

    if (clean.includes("hist")) navigate("/history");
    else if (clean.includes("set")) navigate("/settings");
    else if (clean.includes("ab")) navigate("/about");
    else if (clean.includes("log")) navigate("/login");
    else if (clean.includes("reg")) navigate("/register");
    else navigate(user ? "/dashboard" : "/login");
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#061B2D] px-4 py-12 text-[var(--text-primary)]"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(6, 27, 45, 0.88), rgba(6, 27, 45, 0.96)), url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Topographic Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(45,212,191,0.08),transparent_70%)]" />

      {/* Main Container Card */}
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-white/10 bg-[#092238]/90 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        
        {/* Animated Sonar Radar Beacon */}
        <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
          {/* Outer Pulsing Radar Rings */}
          <span className="absolute inset-0 animate-ping rounded-full border border-teal-400/20 bg-teal-500/5 duration-1000" />
          <span className="absolute -inset-4 animate-pulse rounded-full border border-teal-400/10" />
          <span className="absolute inset-2 rounded-full border border-teal-500/30 bg-teal-950/40" />

          {/* Center Glow Icon */}
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-400/40 bg-gradient-to-br from-teal-500/20 to-teal-900/40 text-[#2DD4BF] shadow-[0_0_20px_rgba(45,212,191,0.35)]">
            <Compass className="h-8 w-8 animate-[spin_10s_linear_infinite]" />
          </div>

          {/* Status Badge */}
          <span className="absolute -bottom-2 z-20 flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 backdrop-blur-md">
            <Radio className="h-2.5 w-2.5 animate-pulse text-amber-400" />
            NO FIX
          </span>
        </div>

        {/* 404 Headline */}
        <div className="mb-2">
          <span className="font-mono text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-100 to-amber-200 sm:text-6xl">
            404
          </span>
          <h1 className="mt-1 text-lg font-bold text-white sm:text-xl">
            Off-Trail: Route Not Found
          </h1>
        </div>

        {/* Typewriter Terminal Console */}
        <div className="mb-6 flex min-h-[46px] w-full items-center justify-center rounded-xl border border-teal-500/20 bg-black/40 px-4 py-2 font-mono text-xs text-teal-300/90 shadow-inner">
          <span className="mr-2 text-teal-500/60">$</span>
          <span>{displayText}</span>
          <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-teal-400" />
        </div>

        <p className="mb-6 text-xs text-slate-300 sm:text-sm">
          The requested coordinate does not exist in the active TrailGuard topographic registry. You may have typed an incorrect URL or the waypoint has expired.
        </p>

        {/* Interactive Animated Re-Route Form */}
        <form
          onSubmit={handleRouteSubmit}
          className="mb-6 flex w-full flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              placeholder="Quick jump: dashboard, history, about, settings..."
              className="w-full rounded-xl border border-white/10 bg-[#061B2D]/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/30 bg-[#0E9C8C] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#0c8577] active:scale-95"
          >
            <span>Re-Route</span>
            <CornerDownLeft className="h-3 w-3" />
          </button>
        </form>

        {/* Quick Location Waypoint Pills */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">Waypoints:</span>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-300 transition hover:bg-teal-500/20 hover:text-teal-200"
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-300 transition hover:bg-teal-500/20 hover:text-teal-200"
          >
            History
          </Link>
          <Link
            to="/about"
            className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-300 transition hover:bg-teal-500/20 hover:text-teal-200"
          >
            About SWAAS
          </Link>
          <Link
            to="/settings"
            className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-300 transition hover:bg-teal-500/20 hover:text-teal-200"
          >
            Settings
          </Link>
        </div>

        {/* Primary Navigation Actions */}
        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center">
          <Link
            to={user ? "/dashboard" : "/login"}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0E9C8C] to-[#2DD4BF] px-5 py-2.5 text-xs font-bold text-[#061B2D] shadow-lg shadow-teal-500/20 transition hover:opacity-95 active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Return to Base Camp</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Brand Watermark */}
        <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-400">
          <Navigation className="h-3 w-3 text-teal-400" />
          <span>TrailGuard · Smart Wearable Assistance & Alert System</span>
        </div>
      </div>
    </div>
  );
}
