import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  IoShieldCheckmarkOutline,
  IoPulseOutline,
  IoRadioOutline,
  IoCompassOutline,
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoArrowForwardOutline,
  IoHardwareChipOutline,
  IoChevronDownOutline,
  IoLocationOutline,
  IoThermometerOutline,
  IoLockClosedOutline,
  IoSpeedometerOutline,
  IoLayersOutline,
  IoCubeOutline,
  IoEyeOutline,
  IoFingerPrintOutline,
} from "react-icons/io5";

/* =========================================================================
   1. DYNAMIC VIBRANT 3D BACKGROUND: AURORA MESH & 3D TERRAIN MATRIX
   (Apple / Render / GitHub Universe style with 3D Spatial Depth Layers)
   ========================================================================= */
function VibrantDynamicBackground() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.3 });

  useEffect(() => {
    let rafId;
    const onMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = window.innerWidth || 1920;
        const h = window.innerHeight || 1080;
        setMousePos({
          x: Math.min(Math.max(e.clientX / w, 0), 1),
          y: Math.min(Math.max(e.clientY / h, 0), 1),
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dynamic Ambient Fluid Light Mesh */}
      <div className="absolute -top-[20%] -left-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-transparent blur-[120px] animate-ambient-1" />
      <div className="absolute top-[25%] -right-[15%] h-[750px] w-[750px] rounded-full bg-gradient-to-bl from-emerald-500/20 via-teal-600/15 to-transparent blur-[130px] animate-ambient-2" />
      <div className="absolute -bottom-[20%] left-[20%] h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[140px] animate-ambient-3" />

      {/* Interactive Cursor Spotlight Aura with Depth Lighting */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(850px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(6, 182, 212, 0.16), rgba(99, 102, 241, 0.08), transparent 70%)`,
        }}
      />

      {/* Precision Technical Coordinate Grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 3D Perspective Ground Terrain Floor (Apple / Spatial Cyberpunk Depth) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[650px] overflow-hidden"
        style={{
          perspective: "700px",
          perspectiveOrigin: `${50 + (mousePos.x - 0.5) * 15}% 35%`,
        }}
      >
        <div
          className="absolute inset-x-[-30%] top-10 h-[950px] animate-3d-grid-floor"
          style={{
            transform: `rotateX(74deg) translateY(${(mousePos.y - 0.5) * 25}px) rotateZ(${(mousePos.x - 0.5) * 6}deg)`,
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(to right, rgba(6, 182, 212, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
          }}
        />
      </div>

      {/* Animated Telemetry Scanning Beam */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 shadow-[0_0_15px_#38BDF8] animate-grid-scan" />

      {/* Undulating Dynamic Waveform Stream (Render / GitHub Style) */}
      <div className="absolute inset-x-0 top-1/3 h-96 opacity-25 overflow-hidden">
        <svg
          className="absolute w-[200%] h-full animate-wave-slow"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="none"
            stroke="url(#waveGradient1)"
            strokeWidth="1.5"
            d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,202.7C672,203,768,149,864,128C960,107,1056,117,1152,138.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="none"
            stroke="url(#waveGradient2)"
            strokeWidth="1"
            strokeDasharray="4 6"
            d="M0,96L48,117.3C96,139,192,181,288,176C384,171,480,117,576,106.7C672,96,768,128,864,160C960,192,1056,224,1152,208C1248,192,1344,128,1392,96L1440,64"
          />
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating 3D Telemetry Spatial Nodes (Depth Layer 1 & 2 Parallax) */}
      <div
        className="absolute top-[18%] left-[8%] hidden lg:flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[#0F172A]/70 px-3 py-1 font-mono text-[10px] text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-md transition-transform duration-300 ease-out animate-particle-pulse"
        style={{
          transform: `translate(${(mousePos.x - 0.5) * -35}px, ${(mousePos.y - 0.5) * -35}px)`,
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        <span>BEACON: MT. BLANC // 4,809M</span>
      </div>

      <div
        className="absolute top-[45%] right-[6%] hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#0F172A]/70 px-3 py-1 font-mono text-[10px] text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md transition-transform duration-300 ease-out animate-particle-pulse"
        style={{
          transform: `translate(${(mousePos.x - 0.5) * 45}px, ${(mousePos.y - 0.5) * 45}px)`,
          animationDelay: "1.5s",
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span>LORA MESH // NODE 04 ACTIVE</span>
      </div>
    </div>
  );
}

/* =========================================================================
   2. SPATIAL 3D HARDWARE SHOWCASE CARD (Apple Ultra Style Interactive 3D)
   ========================================================================= */
function SpatialHardwareViewer() {
  const [rotation, setRotation] = useState({ x: 8, y: -12 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeAngle, setActiveAngle] = useState("hero");
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth 3D tilt within safe bounds (-18deg to +18deg)
    const rotateY = ((x - centerX) / centerX) * 16;
    const rotateX = -((y - centerY) / centerY) * 16;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth reset to preset angle
    if (activeAngle === "hero") setRotation({ x: 8, y: -12 });
    if (activeAngle === "top") setRotation({ x: 28, y: 0 });
    if (activeAngle === "side") setRotation({ x: 0, y: -45 });
    if (activeAngle === "sensors") setRotation({ x: -15, y: 35 });
  };

  const setViewPreset = (angle) => {
    setActiveAngle(angle);
    if (angle === "hero") setRotation({ x: 8, y: -12 });
    if (angle === "top") setRotation({ x: 28, y: 0 });
    if (angle === "side") setRotation({ x: 0, y: -45 });
    if (angle === "sensors") setRotation({ x: -15, y: 35 });
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Angle Selector Tabs */}
      <div className="mb-4 flex items-center justify-center gap-2 font-mono text-[11px]">
        {[
          { id: "hero", label: "3D PERSPECTIVE" },
          { id: "top", label: "OLED MATRIX" },
          { id: "side", label: "LORA ANTENNA" },
          { id: "sensors", label: "BIOSENSORS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewPreset(tab.id)}
            className={`rounded-full px-3 py-1.5 transition-all ${
              activeAngle === tab.id
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                : "bg-[#111827]/80 text-[#94A3B8] border border-[#1E293B] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-grab active:cursor-grabbing rounded-[24px] border border-cyan-500/30 bg-gradient-to-b from-[#0F172A]/90 to-[#0A0F17]/95 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(2,132,199,0.15)] backdrop-blur-xl transition-all duration-300 ease-out"
        style={{ perspective: "1200px" }}
      >
        {/* Apple Style Outer Spec Rim Ring */}
        <div className="absolute inset-0 rounded-[24px] pointer-events-none border border-white/10" />

        {/* 3D Tilting Wearable Model Card */}
        <div
          className="relative mx-auto flex flex-col items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(${isHovered ? "30px" : "10px"})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Spatial Holographic Beacon Glow */}
          <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-blue-600/20 blur-2xl" />

          {/* Wearable Chassis (Titanium Rugged Casing) */}
          <div className="relative z-10 w-72 rounded-[32px] border-2 border-slate-600/80 bg-gradient-to-b from-slate-800 via-slate-900 to-black p-5 shadow-[0_15px_35px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.4)]">
            {/* Top Tactical Bezel Screws */}
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 shadow-inner" />
              <span className="font-mono text-[9px] tracking-widest text-cyan-400">
                ESP32-S3 // TITANIUM ULTRA
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 shadow-inner" />
            </div>

            {/* Wearable OLED Screen Glass */}
            <div className="relative overflow-hidden rounded-[20px] border border-slate-700/80 bg-[#030712] p-4.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
              {/* Live Status Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 font-mono text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-bold">LORA 868MHz</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>GPS 12 SAT</span>
                  <span className="text-cyan-400 font-bold">98%</span>
                </div>
              </div>

              {/* Central Dynamic Heart Rate & SpO2 Display */}
              <div className="my-4 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-extrabold tracking-tight text-white">
                      72
                    </span>
                    <span className="font-mono text-xs text-rose-400 font-semibold">
                      BPM
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <IoPulseOutline className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                    <span className="font-mono">MAX30100 OPTICAL</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="font-mono text-3xl font-extrabold text-cyan-300">
                      99
                    </span>
                    <span className="font-mono text-xs text-cyan-400 font-semibold">
                      % SpO2
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    ALT 2,840 M
                  </span>
                </div>
              </div>

              {/* Dynamic Animated Pulse Oximeter Trace */}
              <div className="relative h-12 w-full overflow-hidden rounded-[8px] bg-slate-950/90 border border-slate-800/60 p-1">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 200 40"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,20 L30,20 L40,8 L50,32 L60,18 L70,20 L110,20 L120,5 L130,35 L140,15 L150,20 L200,20"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-ecg-stream"
                  />
                </svg>
              </div>

              {/* Kinematic G-Force Vector Bar */}
              <div className="mt-3 flex items-center justify-between rounded-[8px] bg-slate-900/80 px-2.5 py-1.5 font-mono text-[10px]">
                <span className="text-slate-400">MPU6050 3-AXIS:</span>
                <span className="text-emerald-400 font-semibold">
                  0.98 G [STABLE]
                </span>
                <span className="text-cyan-400">0.02 rad/s</span>
              </div>
            </div>

            {/* Bottom Casing Accent */}
            <div className="mt-2.5 flex items-center justify-between px-2 pt-1 font-mono text-[9px] text-slate-500">
              <span>SWAAS OS v2.4</span>
              <span>AES-256-GCM SECURE</span>
            </div>
          </div>

          {/* Interactive Tilt Hint */}
          <div className="mt-5 flex items-center gap-1.5 font-mono text-[11px] text-cyan-400/80">
            <IoEyeOutline className="h-3.5 w-3.5" />
            <span>INTERACTIVE 3D TILT // DRAG TO ROTATE PERSPECTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. MAIN LANDING COMPONENT (APPLE-STYLE VIBRANT COMMERCIAL ARCHITECTURE)
   ========================================================================= */
export default function Landing() {
  const { themeMode, toggleTheme } = useTheme();
  const [simMode, setSimMode] = useState("normal"); // 'normal' | 'impact' | 'sos'
  const [simTimer, setSimTimer] = useState(30);
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  // Fall countdown simulator ticker
  useEffect(() => {
    let timer;
    if (simMode === "impact") {
      setSimTimer(30);
      timer = setInterval(() => {
        setSimTimer((prev) => {
          if (prev <= 1) {
            setSimMode("sos");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [simMode]);

  const faqs = [
    {
      q: "Does TrailGuard require a monthly cellular subscription?",
      a: "No. TrailGuard operates over open-standard long-range LoRa radio (433/868/915 MHz ISM spectrum) and offline multi-constellation satellite GPS. It transmits directly to basecamp monitoring hubs and peer wearables with zero recurring carrier fees.",
    },
    {
      q: "How does the on-device Edge Risk Engine eliminate false fall alarms?",
      a: "The ESP32-S3 firmware evaluates a 3-stage kinematic vector heuristic: micro-freefall (<0.5g), instantaneous impact shock (>3.0g), and post-impact repose with biomechanical orientation change. A 30-second cancel timer ensures false trips from dropped packs are dismissed before radio broadcast.",
    },
    {
      q: "What happens if a hiker's companion phone battery dies?",
      a: "The wrist wearable operates completely autonomously. Even if the paired phone is depleted or damaged, the hardware node continues acquiring satellite coordinates, monitoring pulse oximetry, and broadcasting emergency packets over LoRa mesh.",
    },
    {
      q: "What is TrailGuard's strict privacy invariant?",
      a: "Unlike commercial fitness bands that monetize your heartbeat in cloud data lakes, everyday vitals remain strictly on-device in an encrypted 7-day rolling buffer. Only during an active, authenticated emergency is an encrypted 6-hour dossier relayed to Search and Rescue coordinators.",
    },
    {
      q: "Can the basecamp dashboard function during internet blackouts?",
      a: "Yes. TrailGuard is built as an offline-first Progressive Web App (PWA). It caches map tiles, controls, and telemetry protocols locally so coordinators can operate in basecamp without internet connectivity.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#070B14] text-[#E2E8F0] selection:bg-cyan-500 selection:text-white">
      {/* Dynamic Background Mesh */}
      <VibrantDynamicBackground />

      {/* =====================================================================
          1. TOP NAVIGATION BAR (Crisp Executive Command)
          ===================================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#1E293B]/80 bg-[#070B14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-transform group-hover:scale-105">
              🛡
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                TRAIL<span className="text-cyan-400">GUARD</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                SWAAS // AUTONOMOUS SAFETY ECOSYSTEM
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 font-mono text-xs font-semibold text-slate-400 md:flex">
            <a href="#overview" className="transition hover:text-white">
              01. OVERVIEW
            </a>
            <a href="#showcase" className="transition hover:text-white">
              02. 3D HARDWARE
            </a>
            <a href="#sensors" className="transition hover:text-white">
              03. SENSORS
            </a>
            <a href="#simulator" className="transition hover:text-white">
              04. SIMULATOR
            </a>
            <a href="#privacy" className="transition hover:text-white">
              05. PRIVACY
            </a>
            <a href="#faq" className="transition hover:text-white">
              06. FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#1E293B] bg-[#111827] text-slate-400 transition hover:bg-[#1E293B] hover:text-white"
              aria-label="Toggle Theme"
              type="button"
            >
              {themeMode === "dark" ? (
                <IoSunnyOutline className="h-4 w-4" />
              ) : (
                <IoMoonOutline className="h-4 w-4" />
              )}
            </button>

            <Link
              to="/login"
              className="hidden rounded-[8px] border border-[#1E293B] bg-[#111827] px-4 py-2 font-mono text-xs font-semibold text-slate-300 transition hover:bg-[#1E293B] hover:text-white sm:inline-block"
            >
              OPERATOR LOGIN
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-[8px] bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] transition hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-[0.98]"
            >
              <span>LAUNCH DASHBOARD</span>
              <IoArrowForwardOutline className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO SECTION — VIBRANT APPLE-STYLE PRODUCT OVERVIEW
          ===================================================================== */}
      <section
        id="overview"
        className="relative z-10 border-b border-[#1E293B]/80 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Mission Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-1.5 font-mono text-xs text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold tracking-wider uppercase">
                  OFF-GRID LORA TELEMETRY // 3D SPATIAL KINEMATICS
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl font-sans uppercase leading-[1.1]">
                Off-Grid Telemetry and Fall Rescue for Wilderness Operations
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg font-sans">
                TrailGuard (SWAAS) delivers industrial-grade autonomous safety for lone workers, alpine hikers, and search-and-rescue units. Combining continuous on-wrist biometrics, 3-stage kinematic fall impact detection, and 15 km LoRa mesh radio links with strict local-first privacy.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4 font-mono text-xs">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] active:scale-[0.98]"
                >
                  <IoShieldCheckmarkOutline className="h-5 w-5" />
                  <span>ACCESS WEB DASHBOARD</span>
                </Link>

                <a
                  href="#showcase"
                  className="flex items-center gap-2 rounded-[10px] border border-[#1E293B] bg-[#111827]/90 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-white"
                >
                  <IoCubeOutline className="h-4 w-4 text-cyan-400" />
                  <span>EXPLORE 3D HARDWARE</span>
                </a>
              </div>

              {/* Realtime KPI Strip */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#1E293B] pt-8 sm:grid-cols-4 font-mono">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">15 KM</div>
                  <div className="text-[11px] text-slate-400 uppercase">LoRa Range</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">&lt; 3.0 G</div>
                  <div className="text-[11px] text-slate-400 uppercase">Kinematic Shock</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">100%</div>
                  <div className="text-[11px] text-slate-400 uppercase">Local Privacy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">0 RECURRING</div>
                  <div className="text-[11px] text-slate-400 uppercase">No Subscription</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Spatial Hardware Showcase */}
            <div id="showcase" className="lg:col-span-5">
              <SpatialHardwareViewer />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. SENSOR SPECIFICATION BENTO (INDUSTRIAL HARDWARE ARCHITECTURE)
          ===================================================================== */}
      <section
        id="sensors"
        className="relative z-10 border-b border-[#1E293B]/80 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
              <IoHardwareChipOutline className="h-4 w-4" />
              <span>TIER 1 HARDWARE SPECIFICATIONS</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans uppercase">
              Engineered for Zero-Coverage Environments
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Each component is chosen for extreme battery efficiency, military-grade RF propagation, and zero-cloud dependence.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "MAX30100",
                title: "MAX30100 Optical Biosensor",
                tag: "CARDIAC & SPO2",
                tagColor: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20",
                icon: IoPulseOutline,
                iconColor: "text-emerald-400",
                spec: "Dual Red/IR photodetector at 100Hz sampling",
                desc: "Continuously tracks heart rate and blood oxygen saturation to detect hypoxia, hypothermia shock, or sudden cardiac stress during alpine ascent.",
              },
              {
                id: "MPU6050",
                title: "MPU6050 6-DoF IMU",
                tag: "FALL DYNAMICS",
                tagColor: "border-cyan-500/30 text-cyan-400 bg-cyan-950/20",
                icon: IoSpeedometerOutline,
                iconColor: "text-cyan-400",
                spec: "3-axis accelerometer + 3-axis gyroscope up to ±16g",
                desc: "Evaluates micro-freefall, instantaneous impact shock, and post-impact repose angle to differentiate genuine slips from dropped equipment.",
              },
              {
                id: "LORA",
                title: "SX1278 LoRa Transceiver",
                tag: "LONG RANGE MESH",
                tagColor: "border-blue-500/30 text-blue-400 bg-blue-950/20",
                icon: IoRadioOutline,
                iconColor: "text-blue-400",
                spec: "433/868/915 MHz ISM band, +20dBm PA output",
                desc: "Broadcasts distress packets up to 15 kilometers over line-of-sight terrain, bypassing cellular tower failures with zero monthly carrier fees.",
              },
              {
                id: "GPS",
                title: "NEO-6M Multi-GNSS Engine",
                tag: "SATELLITE POSITIONING",
                tagColor: "border-amber-500/30 text-amber-400 bg-amber-950/20",
                icon: IoCompassOutline,
                iconColor: "text-amber-400",
                spec: "50-channel receiver, 2.5m CEP horizontal accuracy",
                desc: "Acquires high-precision WGS-84 coordinates and altitude even in deep ravines and dense alpine tree cover, appended to distress beacons.",
              },
              {
                id: "BME280",
                title: "BME280 Environmental Pod",
                tag: "METEOROLOGY",
                tagColor: "border-purple-500/30 text-purple-400 bg-purple-950/20",
                icon: IoThermometerOutline,
                iconColor: "text-purple-400",
                spec: "±1 hPa barometric pressure, ±0.5°C ambient temp",
                desc: "Forecasts rapid barometric pressure drops signaling mountain blizzards, flash floods, or rapid altitude ascent sickness.",
              },
              {
                id: "ESP32S3",
                title: "ESP32-S3 Dual-Core SoC",
                tag: "EDGE COMPUTE CORE",
                tagColor: "border-rose-500/30 text-rose-400 bg-rose-950/20",
                icon: IoLayersOutline,
                iconColor: "text-rose-400",
                spec: "Xtensa 32-bit LX7 @ 240MHz, hardware AES-256",
                desc: "Executes the on-device Edge Risk Engine locally with hardware flash encryption and Ed25519 cryptographic authorization.",
              },
            ].map((sensor) => {
              const Icon = sensor.icon;
              return (
                <div
                  key={sensor.id}
                  className="rounded-[16px] border border-[#1E293B] bg-[#111827]/80 p-6 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${sensor.tagColor}`}>
                      {sensor.tag}
                    </span>
                    <Icon className={`h-5 w-5 ${sensor.iconColor}`} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white font-sans">
                    {sensor.title}
                  </h3>
                  <div className="mt-1 font-mono text-xs text-slate-400">
                    {sensor.spec}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-300">
                    {sensor.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. LIVE INCIDENT SIMULATOR (TEST-DRIVE EMERGENCY LOGIC)
          ===================================================================== */}
      <section
        id="simulator"
        className="relative z-10 border-b border-[#1E293B]/80 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                <IoRadioOutline className="h-4 w-4" />
                <span>INTERACTIVE RESCUE SIMULATOR</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans uppercase">
                Experience Autonomous Incident Response
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                Test the exact 3-stage kinematic fallback engine that triggers when a lone worker or hiker suffers an alpine trauma impact.
              </p>
            </div>

            {/* State Trigger Controls */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSimMode("normal")}
                className={`rounded-[8px] px-4 py-2.5 font-bold transition ${
                  simMode === "normal"
                    ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "border border-[#1E293B] bg-[#111827] text-slate-300 hover:text-white"
                }`}
              >
                1. NORMAL TRAIL MONITORING
              </button>

              <button
                type="button"
                onClick={() => setSimMode("impact")}
                className={`rounded-[8px] px-4 py-2.5 font-bold transition ${
                  simMode === "impact"
                    ? "bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    : "border border-[#1E293B] bg-[#111827] text-slate-300 hover:text-white"
                }`}
              >
                2. TRIGGER FALL IMPACT
              </button>

              <button
                type="button"
                onClick={() => setSimMode("sos")}
                className={`rounded-[8px] px-4 py-2.5 font-bold transition ${
                  simMode === "sos"
                    ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    : "border border-[#1E293B] bg-[#111827] text-slate-300 hover:text-white"
                }`}
              >
                3. EMERGENCY SOS DISPATCH
              </button>
            </div>
          </div>

          {/* Simulator Display Console */}
          <div className="mt-8 rounded-[16px] border border-[#1E293B] bg-[#111827]/90 p-6 sm:p-8 backdrop-blur-xl">
            {simMode === "normal" && (
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-sm font-bold uppercase text-emerald-400">
                      STATUS: NOMINAL // ALL WEARABLE VECTORS STEADY
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    Heart rate, pulse oximetry, and multi-satellite GPS are streaming to the encrypted local SQLite buffer on the user's phone. No cellular or cloud data leaves the mobile device.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
                    <span className="rounded-[6px] border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-emerald-400">
                      HEART RATE: 74 BPM
                    </span>
                    <span className="rounded-[6px] border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-emerald-400">
                      SPO2: 98%
                    </span>
                    <span className="rounded-[6px] border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-emerald-400">
                      SHOCK: 0.98 G
                    </span>
                    <span className="rounded-[6px] border border-slate-700 bg-slate-900 px-3 py-1 text-slate-400">
                      CLOUD STREAMING: OFF (LOCAL-FIRST)
                    </span>
                  </div>
                </div>
                <div className="rounded-[12px] border border-[#1E293B] bg-[#0A0F17] p-5 font-mono text-xs text-slate-400">
                  <div className="text-white font-bold mb-2">LOCAL RISK ENGINE:</div>
                  <div>- Micro-freefall: 0.00 (NOMINAL)</div>
                  <div>- Impact shock: 0.98g (UNDER THRESHOLD)</div>
                  <div>- Biomechanical repose: ACTIVE</div>
                  <div className="mt-2 text-emerald-400">STATE: SECURE / UNCOMPROMISED</div>
                </div>
              </div>
            )}

            {simMode === "impact" && (
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-mono text-sm font-bold uppercase text-amber-400">
                      WARNING: 3.8G IMPACT DETECTED // CANCEL COUNTDOWN ACTIVE
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    A severe kinematic impact shock was registered followed by biomechanical stillness. The wrist wearable is vibrating vigorously and sounding an audible alarm. The user has {simTimer} seconds to cancel before emergency dispatch.
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSimMode("normal")}
                      className="rounded-[8px] bg-emerald-600 px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-emerald-500"
                    >
                      DISMISS (FALSE ALARM)
                    </button>
                    <div className="font-mono text-lg font-bold text-amber-400">
                      AUTO-DISPATCH IN: {simTimer}s
                    </div>
                  </div>
                </div>
                <div className="rounded-[12px] border border-amber-500/30 bg-amber-950/20 p-5 font-mono text-xs text-amber-300">
                  <div className="font-bold mb-2 text-amber-200">KINEMATICS LOG:</div>
                  <div>- Micro-freefall: 420ms (&lt;0.5g)</div>
                  <div>- Instantaneous Shock: 3.84g (&gt;3.0g)</div>
                  <div>- Repose Angle: 78° change</div>
                  <div className="mt-2 text-amber-400 font-bold">STATE: PENDING USER CANCEL</div>
                </div>
              </div>
            )}

            {simMode === "sos" && (
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-mono text-sm font-bold uppercase text-rose-400">
                      CRITICAL: LORA DISTRESS PACKET BROADCASTING // RESCUE ACTIVE
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    Fall countdown expired. The hardware node has engaged LoRa transmitter at +20dBm power. Satellite GPS coordinates and pre-incident biometric package transmitted to Alpine SAR and Basecamp Hub.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
                    <span className="rounded-[6px] border border-rose-500/30 bg-rose-950/20 px-3 py-1 text-rose-400">
                      BEACON: LAT 45.8326° N, LON 6.8652° E
                    </span>
                    <span className="rounded-[6px] border border-rose-500/30 bg-rose-950/20 px-3 py-1 text-rose-400">
                      ALT: 3,120M // ACCURACY 2.1M
                    </span>
                    <span className="rounded-[6px] border border-rose-500/30 bg-rose-950/20 px-3 py-1 text-rose-400">
                      PACKET: ED25519 VERIFIED
                    </span>
                  </div>
                </div>
                <div className="rounded-[12px] border border-rose-500/30 bg-rose-950/20 p-5 font-mono text-xs text-rose-300">
                  <div className="font-bold mb-2 text-rose-200">EMERGENCY DOSSIER:</div>
                  <div>- Session UUID: 8e4b-91f2-c3a7</div>
                  <div>- Cloud Bounded: 6 hours preceding</div>
                  <div>- Ephemeral TTL: 48h Auto-Purge</div>
                  <div className="mt-2 text-rose-400 font-bold">STATUS: SAR RESCUE DISPATCHED</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. PRIVACY & SECURITY ARCHITECTURAL INVARIANTS
          ===================================================================== */}
      <section
        id="privacy"
        className="relative z-10 border-b border-[#1E293B]/80 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
              <IoLockClosedOutline className="h-4 w-4" />
              <span>FAIL-CLOSED PRIVACY GUARANTEE</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans uppercase">
              Zero-Tolerance Invariants: We Never Sell Your Telemetry
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Unlike commercial fitness trackers that monetize your heartbeat into cloud lakes, TrailGuard treats privacy as a safety-critical engineering invariant.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-[16px] border border-[#1E293B] bg-[#111827]/80 p-6 backdrop-blur-md">
              <div className="font-mono text-xs text-cyan-400 font-bold">INVARIANT 01</div>
              <h3 className="mt-2 text-base font-bold text-white">Local-First Privacy</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Normal continuous health telemetry remains strictly in a rolling 7-day encrypted SQLite buffer on your phone. The cloud backend receives zero biometric data unless an emergency is active.
              </p>
            </div>

            <div className="rounded-[16px] border border-[#1E293B] bg-[#111827]/80 p-6 backdrop-blur-md">
              <div className="font-mono text-xs text-emerald-400 font-bold">INVARIANT 02</div>
              <h3 className="mt-2 text-base font-bold text-white">Emergency-Bounded Cloud</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                When SOS or fall countdown triggers, data leaving the device is strictly bounded to the active incident plus at most the preceding 6 hours. Replay queries are hard-capped at 100 points per sensor.
              </p>
            </div>

            <div className="rounded-[16px] border border-[#1E293B] bg-[#111827]/80 p-6 backdrop-blur-md">
              <div className="font-mono text-xs text-purple-400 font-bold">INVARIANT 03</div>
              <h3 className="mt-2 text-base font-bold text-white">Fail-Closed Audit Log</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Any access by search-and-rescue staff to protected health coordinates writes an immutable audit record first. If writing the audit record fails for any reason, the request throws AUDIT_FAILURE (500) and returns zero health data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FREQUENTLY ASKED QUESTIONS (FAQ)
          ===================================================================== */}
      <section
        id="faq"
        className="relative z-10 border-b border-[#1E293B]/80 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
              QUESTIONS & PROTOCOLS
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans uppercase">
              Operational Field Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-[12px] border border-[#1E293B] bg-[#111827]/80 backdrop-blur-md overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? -1 : idx)}
                    className="flex w-full items-center justify-between p-5 text-left font-mono text-xs sm:text-sm font-bold text-white transition hover:bg-[#1E293B]/50"
                  >
                    <span>{faq.q}</span>
                    <IoChevronDownOutline
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 text-cyan-400 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#1E293B] p-5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. EXECUTIVE FOOTER & MISSION LAUNCH
          ===================================================================== */}
      <footer className="relative z-10 bg-[#070B14] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 border-b border-[#1E293B] pb-12 sm:flex-row">
            <div>
              <h3 className="text-2xl font-bold text-white font-sans uppercase">
                Ready to Deploy Wilderness Safety?
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Access the rescue dashboard or register a new wearable node.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-[8px] bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
              >
                LAUNCH MISSION
              </Link>
              <Link
                to="/register"
                className="rounded-[8px] border border-[#1E293B] bg-[#111827] px-6 py-3 font-mono text-xs font-semibold text-slate-300 hover:text-white"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 font-mono text-xs text-slate-500 sm:flex-row">
            <div>© {new Date().getFullYear()} TRAILGUARD (SWAAS). ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-6">
              <Link to="/about" className="hover:text-white">
                ARCHITECTURE
              </Link>
              <Link to="/login" className="hover:text-white">
                LOGIN
              </Link>
              <a href="#privacy" className="hover:text-white">
                PRIVACY INVARIANTS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
