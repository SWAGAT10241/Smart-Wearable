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
} from "react-icons/io5";

/* =========================================================================
   1. DYNAMIC VIBRANT 3D BACKGROUND: DUAL THEME (GPU ACCELERATED & ZERO-LAG)
   ========================================================================= */
function VibrantDynamicBackground({ isDark = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let rafId;
    const onMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const w = window.innerWidth || 1920;
        const h = window.innerHeight || 1080;
        const x = Math.min(Math.max(e.clientX / w, 0), 1);
        const y = Math.min(Math.max(e.clientY / h, 0), 1);

        const el = containerRef.current;
        el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
        el.style.setProperty("--tilt-y", `${((y - 0.5) * 25).toFixed(1)}px`);
        el.style.setProperty("--tilt-z", `${((x - 0.5) * 6).toFixed(1)}deg`);
        el.style.setProperty("--px1", `${((x - 0.5) * -35).toFixed(1)}px`);
        el.style.setProperty("--py1", `${((y - 0.5) * -35).toFixed(1)}px`);
        el.style.setProperty("--px2", `${((x - 0.5) * 45).toFixed(1)}px`);
        el.style.setProperty("--py2", `${((y - 0.5) * 45).toFixed(1)}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-500"
      style={{
        "--mx": "50%",
        "--my": "30%",
        "--tilt-y": "0px",
        "--tilt-z": "0deg",
        "--px1": "0px",
        "--py1": "0px",
        "--px2": "0px",
        "--py2": "0px",
      }}
    >
      {/* Dynamic Ambient Fluid Light Mesh (Native Radial Gradients for Zero GPU Overhead) */}
      <div
        className="absolute -top-[15%] -left-[10%] h-[700px] w-[700px] rounded-full animate-ambient-1"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(14, 165, 233, 0.28) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-[25%] -right-[15%] h-[750px] w-[750px] rounded-full animate-ambient-2"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute -bottom-[20%] left-[20%] h-[800px] w-[800px] rounded-full animate-ambient-3"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(99, 102, 241, 0.20) 0%, transparent 65%)",
        }}
      />

      {/* Interactive Cursor Spotlight Aura (CSS Variable Hardware Compositing) */}
      <div
        className="absolute inset-0 will-change-[background]"
        style={{
          background: isDark
            ? `radial-gradient(850px circle at var(--mx) var(--my), rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.06), transparent 70%)`
            : `radial-gradient(850px circle at var(--mx) var(--my), rgba(2, 132, 199, 0.12), rgba(16, 185, 129, 0.06), transparent 70%)`,
        }}
      />

      {/* Precision Technical Coordinate Grid */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isDark ? 0.14 : 0.09,
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(15, 23, 42, 0.15) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(15, 23, 42, 0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 3D Perspective Ground Terrain Floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[650px] overflow-hidden"
        style={{
          perspective: "700px",
          perspectiveOrigin: "50% 35%",
        }}
      >
        <div
          className="absolute inset-x-[-30%] top-10 h-[950px] animate-3d-grid-floor transition-all duration-300"
          style={{
            transform: `rotateX(74deg) translateY(var(--tilt-y)) rotateZ(var(--tilt-z))`,
            transformOrigin: "50% 0%",
            backgroundImage: isDark
              ? `linear-gradient(to right, rgba(6, 182, 212, 0.25) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(6, 182, 212, 0.25) 1px, transparent 1px)`
              : `linear-gradient(to right, rgba(2, 132, 199, 0.25) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(2, 132, 199, 0.25) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
          }}
        />
      </div>

      {/* Animated Telemetry Scanning Beam */}
      <div
        className={`absolute inset-x-0 h-[2px] animate-grid-scan transition-opacity duration-500 ${
          isDark
            ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 shadow-[0_0_15px_#38BDF8]"
            : "bg-gradient-to-r from-transparent via-cyan-600 to-transparent opacity-30 shadow-[0_0_10px_#0284C7]"
        }`}
      />

      {/* Undulating Dynamic Waveform Stream */}
      <div className={`absolute inset-x-0 top-1/3 h-96 overflow-hidden ${isDark ? "opacity-25" : "opacity-20"}`}>
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
              <stop offset="50%" stopColor={isDark ? "#0284C7" : "#0369A1"} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
              <stop offset="50%" stopColor={isDark ? "#38BDF8" : "#0284C7"} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating 3D Telemetry Spatial Nodes (Depth Layer 1 & 2 Parallax via CSS Variables) */}
      <div
        className={`absolute top-[18%] left-[8%] hidden lg:flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] shadow-sm backdrop-blur-md transition-transform duration-200 ease-out animate-particle-pulse ${
          isDark
            ? "border-cyan-500/30 bg-[#0F172A]/80 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            : "border-cyan-200 bg-white/90 text-cyan-800 shadow-md"
        }`}
        style={{
          transform: "translate3d(var(--px1), var(--py1), 0)",
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
        <span>BEACON: MT. BLANC // 4,809M</span>
      </div>

      <div
        className={`absolute top-[45%] right-[6%] hidden lg:flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] shadow-sm backdrop-blur-md transition-transform duration-200 ease-out animate-particle-pulse ${
          isDark
            ? "border-emerald-500/30 bg-[#0F172A]/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            : "border-emerald-200 bg-white/90 text-emerald-800 shadow-md"
        }`}
        style={{
          transform: "translate3d(var(--px2), var(--py2), 0)",
          animationDelay: "1.5s",
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span>LORA MESH // NODE 04 ACTIVE</span>
      </div>
    </div>
  );
}

/* =========================================================================
   2. SPATIAL 3D HARDWARE SHOWCASE CARD (THEME ADAPTIVE & ZERO-LAG)
   ========================================================================= */
function SpatialHardwareViewer({ isDark = true }) {
  const [activeAngle, setActiveAngle] = useState("hero");
  const cardRef = useRef(null);
  const cardInnerRef = useRef(null);
  const rafRef = useRef(null);

  const angleTransforms = {
    hero: "rotateX(8deg) rotateY(-12deg) translateZ(10px)",
    top: "rotateX(28deg) rotateY(0deg) translateZ(10px)",
    side: "rotateX(0deg) rotateY(-45deg) translateZ(10px)",
    sensors: "rotateX(-15deg) rotateY(35deg) translateZ(10px)",
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current || !cardInnerRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 16;
      const rotateX = -((y - centerY) / centerY) * 16;
      if (cardInnerRef.current) {
        cardInnerRef.current.style.transform = `rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) translateZ(30px)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardInnerRef.current) {
      cardInnerRef.current.style.transform = angleTransforms[activeAngle] || angleTransforms.hero;
    }
  };

  const setViewPreset = (angle) => {
    setActiveAngle(angle);
    if (cardInnerRef.current) {
      cardInnerRef.current.style.transform = angleTransforms[angle] || angleTransforms.hero;
    }
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
                ? isDark
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-sm"
                : isDark
                ? "bg-[#111827]/80 text-[#94A3B8] border border-[#1E293B] hover:text-white"
                : "bg-white/80 text-slate-600 border border-slate-200 hover:text-slate-900"
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
        onMouseLeave={handleMouseLeave}
        className={`relative cursor-grab active:cursor-grabbing rounded-[24px] border p-8 backdrop-blur-xl transition-all duration-300 ease-out ${
          isDark
            ? "border-cyan-500/30 bg-gradient-to-b from-[#0F172A]/90 to-[#0A0F17]/95 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(2,132,199,0.15)]"
            : "border-slate-200 bg-gradient-to-b from-white/95 to-slate-50/95 shadow-[0_20px_50px_rgba(15,23,42,0.1),0_0_20px_rgba(2,132,199,0.1)]"
        }`}
        style={{ perspective: "1200px" }}
      >
        <div className={`absolute inset-0 rounded-[24px] pointer-events-none border ${isDark ? "border-white/10" : "border-slate-900/5"}`} />

        {/* 3D Tilting Wearable Model Card (Zero-lag Ref Transform) */}
        <div
          ref={cardInnerRef}
          className="relative mx-auto flex flex-col items-center justify-center transition-transform duration-200 ease-out will-change-transform"
          style={{
            transform: angleTransforms[activeAngle],
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
                <svg className="h-full w-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path
                    d="M0,20 L30,20 L40,8 L50,32 L60,18 L70,20 L110,20 L120,5 L130,35 L140,15 L150,20 L200,20"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-[8px] bg-slate-900/80 px-2.5 py-1.5 font-mono text-[10px]">
                <span className="text-slate-400">MPU6050 3-AXIS:</span>
                <span className="text-emerald-400 font-semibold">0.98 G [STABLE]</span>
                <span className="text-cyan-400">0.02 rad/s</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between px-2 pt-1 font-mono text-[9px] text-slate-500">
              <span>SWAAS OS v2.4</span>
              <span>AES-256-GCM SECURE</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-1.5 font-mono text-[11px] text-cyan-500 font-semibold">
            <IoEyeOutline className="h-3.5 w-3.5" />
            <span>INTERACTIVE 3D TILT // DRAG TO ROTATE PERSPECTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. MAIN LANDING COMPONENT (DYNAMIC LIGHT & DARK ADAPTIVE)
   ========================================================================= */
export default function Landing() {
  const { theme, toggleTheme, isDark } = useTheme();

  const [simMode, setSimMode] = useState("normal"); // 'normal' | 'impact' | 'sos'
  const [simTimer, setSimTimer] = useState(30);
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

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
    <div
      className={`relative min-h-screen transition-colors duration-500 selection:bg-cyan-500 selection:text-white ${
        isDark ? "bg-[#070B14] text-[#E2E8F0]" : "bg-[#F8FAFC] text-[#0F172A]"
      }`}
    >
      {/* Dynamic Adaptive 3D Background */}
      <VibrantDynamicBackground isDark={isDark} />

      {/* =====================================================================
          1. TOP NAVIGATION BAR (Adaptive)
          ===================================================================== */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${
          isDark
            ? "border-[#1E293B]/80 bg-[#070B14]/85 text-slate-300"
            : "border-slate-200/80 bg-white/85 text-slate-700"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-transform group-hover:scale-105">
              🛡
            </span>
            <div className="flex flex-col">
              <span className={`text-lg font-bold tracking-tight font-sans ${isDark ? "text-white" : "text-slate-900"}`}>
                TRAIL<span className="text-cyan-500">GUARD</span>
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                SWAAS // AUTONOMOUS SAFETY ECOSYSTEM
              </span>
            </div>
          </Link>

          <nav className={`hidden items-center gap-8 font-mono text-xs font-semibold md:flex ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <a href="#overview" className={`transition ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
              01. OVERVIEW
            </a>
            <a href="#showcase" className={`transition ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
              02. 3D HARDWARE
            </a>
            <a href="#sensors" className={`transition ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
              03. SENSORS
            </a>
            <a href="#simulator" className={`transition ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
              04. SIMULATOR
            </a>
            <a href="#privacy" className={`transition ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
              05. PRIVACY
            </a>
            <a href="#faq" className={`transition ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
              06. FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 font-mono text-xs font-bold transition shadow-xs ${
                isDark
                  ? "border-[#1E293B] bg-[#111827] text-amber-400 hover:bg-[#1E293B] hover:text-white"
                  : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900 shadow-sm"
              }`}
              aria-label="Toggle Theme"
              type="button"
            >
              {isDark ? (
                <>
                  <IoSunnyOutline className="h-4 w-4 text-amber-400" />
                  <span className="hidden sm:inline">LIGHT MODE</span>
                </>
              ) : (
                <>
                  <IoMoonOutline className="h-4 w-4 text-slate-700" />
                  <span className="hidden sm:inline">DARK MODE</span>
                </>
              )}
            </button>

            <Link
              to="/login"
              className={`hidden rounded-[8px] border px-4 py-2 font-mono text-xs font-semibold transition sm:inline-block ${
                isDark
                  ? "border-[#1E293B] bg-[#111827] text-slate-300 hover:bg-[#1E293B] hover:text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs"
              }`}
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
          2. HERO SECTION — VIBRANT PRODUCT OVERVIEW
          ===================================================================== */}
      <section
        id="overview"
        className={`relative z-10 border-b px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-[#1E293B]/80" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold ${
                  isDark
                    ? "border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "border-cyan-200 bg-cyan-50 text-cyan-800 shadow-sm"
                }`}
              >
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold tracking-wider uppercase">
                  OFF-GRID LORA TELEMETRY // 3D SPATIAL KINEMATICS
                </span>
              </div>

              <h1 className={`mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl font-sans uppercase leading-[1.1] ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                Off-Grid Telemetry and Fall Rescue for Wilderness Operations
              </h1>

              <p className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg font-sans ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}>
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
                  className={`flex items-center gap-2 rounded-[10px] border px-6 py-3.5 text-sm font-semibold transition ${
                    isDark
                      ? "border-[#1E293B] bg-[#111827]/90 text-slate-200 hover:border-cyan-500/50 hover:text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-slate-900 shadow-sm"
                  }`}
                >
                  <IoCubeOutline className="h-4 w-4 text-cyan-500" />
                  <span>EXPLORE 3D HARDWARE</span>
                </a>
              </div>

              {/* Realtime KPI Strip */}
              <div className={`mt-12 grid grid-cols-2 gap-4 border-t pt-8 sm:grid-cols-4 font-mono ${
                isDark ? "border-[#1E293B]" : "border-slate-200"
              }`}>
                <div>
                  <div className="text-2xl font-bold text-cyan-500">15 KM</div>
                  <div className={`text-[11px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>LoRa Range</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-500">&lt; 3.0 G</div>
                  <div className={`text-[11px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>Kinematic Shock</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">100%</div>
                  <div className={`text-[11px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>Local Privacy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-500">0 RECURRING</div>
                  <div className={`text-[11px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>No Subscription</div>
                </div>
              </div>
            </div>

            <div id="showcase" className="lg:col-span-5">
              <SpatialHardwareViewer isDark={isDark} />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. SENSOR SPECIFICATION BENTO (Adaptive)
          ===================================================================== */}
      <section
        id="sensors"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-[#1E293B]/80" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-500 font-bold uppercase tracking-wider">
              <IoHardwareChipOutline className="h-4 w-4" />
              <span>TIER 1 HARDWARE SPECIFICATIONS</span>
            </div>
            <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl font-sans uppercase ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Engineered for Zero-Coverage Environments
            </h2>
            <p className={`mt-3 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Each component is chosen for extreme battery efficiency, military-grade RF propagation, and zero-cloud dependence.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "MAX30100",
                title: "MAX30100 Optical Biosensor",
                tag: "CARDIAC & SPO2",
                tagColor: isDark ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/20" : "border-emerald-200 text-emerald-800 bg-emerald-50",
                icon: IoPulseOutline,
                iconColor: "text-emerald-500",
                spec: "Dual Red/IR photodetector at 100Hz sampling",
                desc: "Continuously tracks heart rate and blood oxygen saturation to detect hypoxia, hypothermia shock, or sudden cardiac stress during alpine ascent.",
              },
              {
                id: "MPU6050",
                title: "MPU6050 6-DoF IMU",
                tag: "FALL DYNAMICS",
                tagColor: isDark ? "border-cyan-500/30 text-cyan-400 bg-cyan-950/20" : "border-cyan-200 text-cyan-800 bg-cyan-50",
                icon: IoSpeedometerOutline,
                iconColor: "text-cyan-500",
                spec: "3-axis accelerometer + 3-axis gyroscope up to ±16g",
                desc: "Evaluates micro-freefall, instantaneous impact shock, and post-impact repose angle to differentiate genuine slips from dropped equipment.",
              },
              {
                id: "LORA",
                title: "SX1278 LoRa Transceiver",
                tag: "LONG RANGE MESH",
                tagColor: isDark ? "border-blue-500/30 text-blue-400 bg-blue-950/20" : "border-blue-200 text-blue-800 bg-blue-50",
                icon: IoRadioOutline,
                iconColor: "text-blue-500",
                spec: "433/868/915 MHz ISM band, +20dBm PA output",
                desc: "Broadcasts distress packets up to 15 kilometers over line-of-sight terrain, bypassing cellular tower failures with zero monthly carrier fees.",
              },
              {
                id: "GPS",
                title: "NEO-6M Multi-GNSS Engine",
                tag: "SATELLITE POSITIONING",
                tagColor: isDark ? "border-amber-500/30 text-amber-400 bg-amber-950/20" : "border-amber-200 text-amber-800 bg-amber-50",
                icon: IoCompassOutline,
                iconColor: "text-amber-500",
                spec: "50-channel receiver, 2.5m CEP horizontal accuracy",
                desc: "Acquires high-precision WGS-84 coordinates and altitude even in deep ravines and dense alpine tree cover, appended to distress beacons.",
              },
              {
                id: "BME280",
                title: "BME280 Environmental Pod",
                tag: "METEOROLOGY",
                tagColor: isDark ? "border-purple-500/30 text-purple-400 bg-purple-950/20" : "border-purple-200 text-purple-800 bg-purple-50",
                icon: IoThermometerOutline,
                iconColor: "text-purple-500",
                spec: "±1 hPa barometric pressure, ±0.5°C ambient temp",
                desc: "Forecasts rapid barometric pressure drops signaling mountain blizzards, flash floods, or rapid altitude ascent sickness.",
              },
              {
                id: "ESP32S3",
                title: "ESP32-S3 Dual-Core SoC",
                tag: "EDGE COMPUTE CORE",
                tagColor: isDark ? "border-rose-500/30 text-rose-400 bg-rose-950/20" : "border-rose-200 text-rose-800 bg-rose-50",
                icon: IoLayersOutline,
                iconColor: "text-rose-500",
                spec: "Xtensa 32-bit LX7 @ 240MHz, hardware AES-256",
                desc: "Executes the on-device Edge Risk Engine locally with hardware flash encryption and Ed25519 cryptographic authorization.",
              },
            ].map((sensor) => {
              const Icon = sensor.icon;
              return (
                <div
                  key={sensor.id}
                  className={`rounded-[16px] border p-6 backdrop-blur-md transition-all duration-300 ${
                    isDark
                      ? "border-[#1E293B] bg-[#111827]/80 hover:border-cyan-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                      : "border-slate-200 bg-white/90 hover:border-cyan-400 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${sensor.tagColor}`}>
                      {sensor.tag}
                    </span>
                    <Icon className={`h-5 w-5 ${sensor.iconColor}`} />
                  </div>
                  <h3 className={`mt-4 text-lg font-bold font-sans ${isDark ? "text-white" : "text-slate-900"}`}>
                    {sensor.title}
                  </h3>
                  <div className={`mt-1 font-mono text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {sensor.spec}
                  </div>
                  <p className={`mt-3 text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {sensor.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. LIVE INCIDENT SIMULATOR (Adaptive)
          ===================================================================== */}
      <section
        id="simulator"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-[#1E293B]/80" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-500 font-bold uppercase tracking-wider">
                <IoRadioOutline className="h-4 w-4" />
                <span>INTERACTIVE RESCUE SIMULATOR</span>
              </div>
              <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl font-sans uppercase ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                Experience Autonomous Incident Response
              </h2>
              <p className={`mt-3 max-w-2xl text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Test the exact 3-stage kinematic fallback engine that triggers when a lone worker or hiker suffers an alpine trauma impact.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSimMode("normal")}
                className={`rounded-[8px] px-4 py-2.5 font-bold transition ${
                  simMode === "normal"
                    ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : isDark
                    ? "border border-[#1E293B] bg-[#111827] text-slate-300 hover:text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-xs"
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
                    : isDark
                    ? "border border-[#1E293B] bg-[#111827] text-slate-300 hover:text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-xs"
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
                    : isDark
                    ? "border border-[#1E293B] bg-[#111827] text-slate-300 hover:text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-xs"
                }`}
              >
                3. EMERGENCY SOS DISPATCH
              </button>
            </div>
          </div>

          {/* Simulator Display Console */}
          <div
            className={`mt-8 rounded-[16px] border p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 ${
              isDark
                ? "border-[#1E293B] bg-[#111827]/90"
                : "border-slate-200 bg-white/95 shadow-md"
            }`}
          >
            {simMode === "normal" && (
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-sm font-bold uppercase text-emerald-500">
                      STATUS: NOMINAL // ALL WEARABLE VECTORS STEADY
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    Heart rate, pulse oximetry, and multi-satellite GPS are streaming to the encrypted local SQLite buffer on the user's phone. No cellular or cloud data leaves the mobile device.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
                    <span className={`rounded-[6px] border px-3 py-1 font-semibold ${
                      isDark ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400" : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}>
                      HEART RATE: 74 BPM
                    </span>
                    <span className={`rounded-[6px] border px-3 py-1 font-semibold ${
                      isDark ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400" : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}>
                      SPO2: 98%
                    </span>
                    <span className={`rounded-[6px] border px-3 py-1 font-semibold ${
                      isDark ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400" : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}>
                      SHOCK: 0.98 G
                    </span>
                    <span className={`rounded-[6px] border px-3 py-1 ${
                      isDark ? "border-slate-700 bg-slate-900 text-slate-400" : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}>
                      CLOUD STREAMING: OFF (LOCAL-FIRST)
                    </span>
                  </div>
                </div>
                <div className={`rounded-[12px] border p-5 font-mono text-xs ${
                  isDark ? "border-[#1E293B] bg-[#0A0F17] text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"
                }`}>
                  <div className={`font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>LOCAL RISK ENGINE:</div>
                  <div>- Micro-freefall: 0.00 (NOMINAL)</div>
                  <div>- Impact shock: 0.98g (UNDER THRESHOLD)</div>
                  <div>- Biomechanical repose: ACTIVE</div>
                  <div className="mt-2 text-emerald-500 font-bold">STATE: SECURE / UNCOMPROMISED</div>
                </div>
              </div>
            )}

            {simMode === "impact" && (
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 rounded-full bg-amber-500 animate-ping" />
                    <span className="font-mono text-sm font-bold uppercase text-amber-500">
                      WARNING: 3.8G IMPACT DETECTED // CANCEL COUNTDOWN ACTIVE
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    A severe kinematic impact shock was registered followed by biomechanical stillness. The wrist wearable is vibrating vigorously and sounding an audible alarm. The user has {simTimer} seconds to cancel before emergency dispatch.
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSimMode("normal")}
                      className="rounded-[8px] bg-emerald-600 px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
                    >
                      DISMISS (FALSE ALARM)
                    </button>
                    <div className="font-mono text-lg font-bold text-amber-500">
                      AUTO-DISPATCH IN: {simTimer}s
                    </div>
                  </div>
                </div>
                <div className={`rounded-[12px] border p-5 font-mono text-xs ${
                  isDark ? "border-amber-500/30 bg-amber-950/20 text-amber-300" : "border-amber-200 bg-amber-50 text-amber-900"
                }`}>
                  <div className="font-bold mb-2">KINEMATICS LOG:</div>
                  <div>- Micro-freefall: 420ms (&lt;0.5g)</div>
                  <div>- Instantaneous Shock: 3.84g (&gt;3.0g)</div>
                  <div>- Repose Angle: 78° change</div>
                  <div className="mt-2 text-amber-500 font-bold">STATE: PENDING USER CANCEL</div>
                </div>
              </div>
            )}

            {simMode === "sos" && (
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-mono text-sm font-bold uppercase text-rose-500">
                      CRITICAL: LORA DISTRESS PACKET BROADCASTING // RESCUE ACTIVE
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    Fall countdown expired. The hardware node has engaged LoRa transmitter at +20dBm power. Satellite GPS coordinates and pre-incident biometric package transmitted to Alpine SAR and Basecamp Hub.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
                    <span className={`rounded-[6px] border px-3 py-1 font-semibold ${
                      isDark ? "border-rose-500/30 bg-rose-950/20 text-rose-400" : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}>
                      BEACON: LAT 45.8326° N, LON 6.8652° E
                    </span>
                    <span className={`rounded-[6px] border px-3 py-1 font-semibold ${
                      isDark ? "border-rose-500/30 bg-rose-950/20 text-rose-400" : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}>
                      ALT: 3,120M // ACCURACY 2.1M
                    </span>
                    <span className={`rounded-[6px] border px-3 py-1 font-semibold ${
                      isDark ? "border-rose-500/30 bg-rose-950/20 text-rose-400" : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}>
                      PACKET: ED25519 VERIFIED
                    </span>
                  </div>
                </div>
                <div className={`rounded-[12px] border p-5 font-mono text-xs ${
                  isDark ? "border-rose-500/30 bg-rose-950/20 text-rose-300" : "border-rose-200 bg-rose-50 text-rose-900"
                }`}>
                  <div className="font-bold mb-2">EMERGENCY DOSSIER:</div>
                  <div>- Session UUID: 8e4b-91f2-c3a7</div>
                  <div>- Cloud Bounded: 6 hours preceding</div>
                  <div>- Ephemeral TTL: 48h Auto-Purge</div>
                  <div className="mt-2 text-rose-500 font-bold">STATUS: SAR RESCUE DISPATCHED</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. PRIVACY & SECURITY ARCHITECTURAL INVARIANTS (Adaptive)
          ===================================================================== */}
      <section
        id="privacy"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-[#1E293B]/80" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-500 font-bold uppercase tracking-wider">
              <IoLockClosedOutline className="h-4 w-4" />
              <span>FAIL-CLOSED PRIVACY GUARANTEE</span>
            </div>
            <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl font-sans uppercase ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Zero-Tolerance Invariants: We Never Sell Your Telemetry
            </h2>
            <p className={`mt-3 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Unlike commercial fitness trackers that monetize your heartbeat into cloud lakes, TrailGuard treats privacy as a safety-critical engineering invariant.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className={`rounded-[16px] border p-6 backdrop-blur-md transition-all duration-300 ${
              isDark ? "border-[#1E293B] bg-[#111827]/80" : "border-slate-200 bg-white/90 shadow-sm"
            }`}>
              <div className="font-mono text-xs text-cyan-500 font-bold">INVARIANT 01</div>
              <h3 className={`mt-2 text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Local-First Privacy</h3>
              <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Normal continuous health telemetry remains strictly in a rolling 7-day encrypted SQLite buffer on your phone. The cloud backend receives zero biometric data unless an emergency is active.
              </p>
            </div>

            <div className={`rounded-[16px] border p-6 backdrop-blur-md transition-all duration-300 ${
              isDark ? "border-[#1E293B] bg-[#111827]/80" : "border-slate-200 bg-white/90 shadow-sm"
            }`}>
              <div className="font-mono text-xs text-emerald-500 font-bold">INVARIANT 02</div>
              <h3 className={`mt-2 text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Emergency-Bounded Cloud</h3>
              <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                When SOS or fall countdown triggers, data leaving the device is strictly bounded to the active incident plus at most the preceding 6 hours. Replay queries are hard-capped at 100 points per sensor.
              </p>
            </div>

            <div className={`rounded-[16px] border p-6 backdrop-blur-md transition-all duration-300 ${
              isDark ? "border-[#1E293B] bg-[#111827]/80" : "border-slate-200 bg-white/90 shadow-sm"
            }`}>
              <div className="font-mono text-xs text-purple-500 font-bold">INVARIANT 03</div>
              <h3 className={`mt-2 text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Fail-Closed Audit Log</h3>
              <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Any access by search-and-rescue staff to protected health coordinates writes an immutable audit record first. If writing the audit record fails for any reason, the request throws AUDIT_FAILURE (500) and returns zero health data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FREQUENTLY ASKED QUESTIONS (Adaptive)
          ===================================================================== */}
      <section
        id="faq"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-[#1E293B]/80" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="font-mono text-xs text-cyan-500 font-bold uppercase tracking-wider">
              QUESTIONS & PROTOCOLS
            </div>
            <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl font-sans uppercase ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Operational Field Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-[12px] border backdrop-blur-md overflow-hidden transition-all duration-300 ${
                    isDark
                      ? "border-[#1E293B] bg-[#111827]/80"
                      : "border-slate-200 bg-white/90 shadow-xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? -1 : idx)}
                    className={`flex w-full items-center justify-between p-5 text-left font-mono text-xs sm:text-sm font-bold transition ${
                      isDark
                        ? "text-white hover:bg-[#1E293B]/50"
                        : "text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>{faq.q}</span>
                    <IoChevronDownOutline
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 text-cyan-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className={`border-t p-5 text-xs leading-relaxed sm:text-sm ${
                      isDark ? "border-[#1E293B] text-slate-400" : "border-slate-200 text-slate-600"
                    }`}>
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
          7. EXECUTIVE FOOTER & MISSION LAUNCH (Adaptive)
          ===================================================================== */}
      <footer
        className={`relative z-10 py-16 transition-colors duration-500 ${
          isDark ? "bg-[#070B14]" : "bg-slate-100"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col items-center justify-between gap-6 border-b pb-12 sm:flex-row ${
            isDark ? "border-[#1E293B]" : "border-slate-300"
          }`}>
            <div>
              <h3 className={`text-2xl font-bold font-sans uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                Ready to Deploy Wilderness Safety?
              </h3>
              <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
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
                className={`rounded-[8px] border px-6 py-3 font-mono text-xs font-semibold transition ${
                  isDark
                    ? "border-[#1E293B] bg-[#111827] text-slate-300 hover:text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-xs"
                }`}
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>

          <div className={`mt-8 flex flex-col items-center justify-between gap-4 font-mono text-xs sm:flex-row ${
            isDark ? "text-slate-500" : "text-slate-500"
          }`}>
            <div>© {new Date().getFullYear()} TRAILGUARD (SWAAS). ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-6">
              <Link to="/about" className={`hover:underline ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
                ARCHITECTURE
              </Link>
              <Link to="/login" className={`hover:underline ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
                LOGIN
              </Link>
              <a href="#privacy" className={`hover:underline ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
                PRIVACY INVARIANTS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
