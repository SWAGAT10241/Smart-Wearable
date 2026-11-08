import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  IoShieldCheckmarkOutline,
  IoPulseOutline,
  IoCompassOutline,
  IoRadioOutline,
  IoFlashOutline,
  IoHardwareChipOutline,
  IoCheckmarkCircleOutline,
  IoChevronDownOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoArrowForwardOutline,
  IoAlertCircleOutline,
  IoThermometerOutline,
  IoLockClosedOutline,
  IoSpeedometerOutline,
  IoSparklesOutline,
  IoWifiOutline,
  IoNavigateOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { FaMountainSun } from "react-icons/fa6";
import { RiCpuLine, RiRadarLine, RiSignalTowerLine } from "react-icons/ri";

/* =========================================================================
   1. Interactive Topographic Elevation Contour Canvas (AAA Game Terrain)
   ========================================================================= */
function TopographicCanvas({ themeMode = "dark", accent = "#06B6D4" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Simple pseudo-noise terrain field
    const noise = (x, y, time) => {
      return (
        Math.sin(x * 0.003 + time * 0.3) * Math.cos(y * 0.003 + time * 0.2) +
        Math.sin(x * 0.007 - y * 0.005 + time * 0.15) * 0.5 +
        Math.sin((x + y) * 0.002 - time * 0.1) * 0.8
      );
    };

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const isDark = themeMode === "dark";
      const baseAlpha = isDark ? 0.18 : 0.14;
      const step = 42; // Grid density

      // Multi-layer contour lines
      const levels = [-0.9, -0.6, -0.3, 0.0, 0.3, 0.6, 0.9, 1.2];

      levels.forEach((lvl, lvlIdx) => {
        const isIndexLine = lvlIdx % 3 === 0;
        ctx.beginPath();
        ctx.lineWidth = isIndexLine ? 1.5 : 0.75;

        // Vivid multi-color accent index styling
        if (isIndexLine) {
          ctx.strokeStyle = lvlIdx === 0 ? "rgba(6, 182, 212, 0.35)" : lvlIdx === 3 ? "rgba(245, 158, 11, 0.35)" : "rgba(16, 185, 129, 0.35)";
        } else {
          ctx.strokeStyle = isDark ? `rgba(148, 163, 184, ${baseAlpha * 0.6})` : `rgba(100, 116, 139, ${baseAlpha * 0.5})`;
        }

        // Draw horizontal marching elevation ribbons
        for (let y = 0; y < h; y += step) {
          let lineStarted = false;
          for (let x = 0; x < w; x += step) {
            const val = noise(x, y, t);
            if (Math.abs(val - lvl) < 0.22) {
              const offsetY = (val - lvl) * 28;
              if (!lineStarted) {
                ctx.moveTo(x, y + offsetY);
                lineStarted = true;
              } else {
                ctx.lineTo(x, y + offsetY);
              }
            } else {
              lineStarted = false;
            }
          }
        }
        ctx.stroke();
      });

      // Technical micro-grid crosshairs
      ctx.fillStyle = isDark ? "rgba(45, 212, 191, 0.25)" : "rgba(13, 148, 136, 0.3)";
      for (let x = 120; x < w; x += 280) {
        for (let y = 120; y < h; y += 240) {
          ctx.fillRect(x - 3, y, 7, 1);
          ctx.fillRect(x, y - 3, 1, 7);
        }
      }

      t += 0.004;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [themeMode, accent]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
}

/* =========================================================================
   2. Live 60FPS ECG Biosensor Canvas (Medical Cardiac Trace)
   ========================================================================= */
function LiveECGTrace({ color = "#10B981" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let offset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Neon glowing trace
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();

      const midY = height / 2;
      const period = 110;

      for (let x = 0; x < width; x++) {
        const cycle = (x + offset) % period;
        let y = midY;

        // P wave
        if (cycle > 18 && cycle <= 28) {
          y -= Math.sin(((cycle - 18) / 10) * Math.PI) * 4;
        }
        // Q dip
        else if (cycle > 32 && cycle <= 36) {
          y += 5;
        }
        // R sharp systolic spike
        else if (cycle > 36 && cycle <= 42) {
          y -= 28;
        }
        // S dip
        else if (cycle > 42 && cycle <= 48) {
          y += 10;
        }
        // T ventricular recovery wave
        else if (cycle > 58 && cycle <= 78) {
          y -= Math.sin(((cycle - 58) / 20) * Math.PI) * 8;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      offset = (offset + 1.8) % period;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={64}
      className="h-[64px] w-full"
    />
  );
}

/* =========================================================================
   3. AAA Game HUD Wearable Flight Console (3D Gyroscope Physics)
   ========================================================================= */
function GameTacticalConsole({ cursorVector, currentMode = "normal" }) {
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [compassHeading, setCompassHeading] = useState(142);

  // Smooth inertial interpolation following cursor
  useEffect(() => {
    const targetPitch = ((cursorVector.y - window.innerHeight / 2) / (window.innerHeight / 2)) * -14;
    const targetRoll = ((cursorVector.x - window.innerWidth / 2) / (window.innerWidth / 2)) * 14;
    setPitch((prev) => prev + (targetPitch - prev) * 0.1);
    setRoll((prev) => prev + (targetRoll - prev) * 0.1);

    const angle = (Math.atan2(cursorVector.y - window.innerHeight / 2, cursorVector.x - window.innerWidth / 2) * 180) / Math.PI + 180;
    setCompassHeading(Math.round(angle));
  }, [cursorVector]);

  const modeThemes = {
    normal: {
      accent: "#06B6D4",
      accentGlow: "rgba(6, 182, 212, 0.4)",
      statusText: "SYSTEM ARMED // MESH NOMINAL",
      statusBadge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    impact: {
      accent: "#F59E0B",
      accentGlow: "rgba(245, 158, 11, 0.45)",
      statusText: "HIGH G-FORCE IMPACT DETECTED (4.82G)",
      statusBadge: "bg-amber-500/15 text-amber-400 border-amber-500/40 animate-pulse",
    },
    sos: {
      accent: "#EF4444",
      accentGlow: "rgba(239, 68, 68, 0.6)",
      statusText: "CRITICAL SOS // LORA BURST BROADCASTING",
      statusBadge: "bg-red-500/20 text-red-400 border-red-500/50 animate-bounce",
    },
  };

  const theme = modeThemes[currentMode] || modeThemes.normal;

  return (
    <div
      style={{
        transform: `perspective(1200px) rotateX(${pitch.toFixed(2)}deg) rotateY(${roll.toFixed(2)}deg)`,
        transition: "transform 0.08s ease-out",
      }}
      className="relative will-change-transform"
    >
      {/* Outer Tactical Bezel Frame */}
      <div className="relative rounded-[28px] border-2 border-slate-700/60 bg-gradient-to-b from-slate-900 via-[#07111D] to-[#04090F] p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Corner Reticles */}
        <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-cyan-400/80" />
        <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-cyan-400/80" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-cyan-400/80" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-cyan-400/80" />

        {/* Top Header Deck: Mission Protocol Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            <span className="font-bold tracking-wider text-slate-200">TRAILGUARD HUD-S3</span>
            <span className="text-slate-500">//</span>
            <span className="text-cyan-400 font-semibold">ESP32-S3 CORE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[10px] text-slate-300">
              RF: 433.92 MHz
            </span>
            <span className="font-bold text-amber-400">CHIRP SF12</span>
          </div>
        </div>

        {/* Central Tactical HUD Viewport */}
        <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-12">
          {/* Left Panel: Biosensor Core */}
          <div className="space-y-3 lg:col-span-4">
            {/* Cardiac Telemetry Box */}
            <div className="rounded-[16px] border border-slate-800 bg-slate-950/70 p-3.5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  PHOTOPLETHYSMOGRAPHY
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-red-400">
                  <IoPulseOutline className="animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-3xl font-extrabold text-red-500">76</span>
                  <span className="ml-1 font-mono text-xs text-slate-400">BPM</span>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-300">
                  <span className="text-slate-500">SpO₂:</span> <span className="font-bold text-cyan-400">98%</span>
                </div>
              </div>
              <div className="mt-2 overflow-hidden rounded-[8px] bg-black/60 border border-slate-900">
                <LiveECGTrace color="#F43F5E" />
              </div>
            </div>

            {/* Weather / Barometric Box */}
            <div className="rounded-[16px] border border-slate-800 bg-slate-950/70 p-3.5 shadow-inner">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                <span>BME280 BAROMETER</span>
                <span className="text-cyan-400">ALPINE COND</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 font-mono">
                <div>
                  <div className="text-[10px] text-slate-500">PRESSURE</div>
                  <div className="text-base font-bold text-slate-200">1014.2 hPa</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">TEMPERATURE</div>
                  <div className="text-base font-bold text-amber-400">21.8°C</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Instrument: 3D Geodetic Radar & Vector Reticle */}
          <div className="relative flex flex-col items-center justify-center rounded-[20px] border border-slate-800 bg-black/80 p-5 shadow-inner lg:col-span-4 overflow-hidden">
            {/* Radar Conic Sweep Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
              <div className="h-44 w-44 rounded-full border border-cyan-500/20" />
              <div className="absolute h-32 w-32 rounded-full border border-cyan-500/30" />
              <div className="absolute h-20 w-20 rounded-full border border-dashed border-cyan-400/40" />
              <div
                className="absolute inset-0 animate-radar-sweep"
                style={{
                  background: "conic-gradient(from 0deg, transparent 70%, rgba(6, 182, 212, 0.45) 100%)",
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* Central Compass Heading Reticle */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan-400/60 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                <IoNavigateOutline
                  style={{ transform: `rotate(${compassHeading}deg)` }}
                  className="text-3xl text-cyan-300 transition-transform duration-75 drop-shadow-[0_0_8px_#22D3EE]"
                />
              </div>

              <div className="mt-3 text-center font-mono">
                <div className="text-xs font-bold text-cyan-300 tracking-wider">
                  20.2961° N, 85.8245° E
                </div>
                <div className="text-[10px] text-slate-400">HEADING {compassHeading}° · ELEV +1,842M</div>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                NEO-6M SAT LOCK (12/12)
              </div>
            </div>
          </div>

          {/* Right Panel: MPU6050 6-Axis Dynamic Gyroscope Vector Matrix */}
          <div className="space-y-3 lg:col-span-4">
            <div className="rounded-[16px] border border-slate-800 bg-slate-950/70 p-3.5 shadow-inner">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
                <span>MPU-6050 6-AXIS IMU</span>
                <span className="text-amber-400 font-bold">INTERACTIVE</span>
              </div>
              <div className="mt-2 space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">PITCH (X):</span>
                  <span className="font-bold text-cyan-400">{pitch.toFixed(1)}°</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-75"
                    style={{ width: `${Math.min(100, Math.max(0, 50 + pitch * 2))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">ROLL (Y):</span>
                  <span className="font-bold text-amber-400">{roll.toFixed(1)}°</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-75"
                    style={{ width: `${Math.min(100, Math.max(0, 50 + roll * 2))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                  <span className="text-slate-500">G-FORCE VECTOR:</span>
                  <span className="font-bold text-emerald-400">
                    {(1.0 + Math.abs(pitch + roll) * 0.02).toFixed(2)}g
                  </span>
                </div>
              </div>
            </div>

            {/* Cryptographic Ed25519 Seal */}
            <div className="rounded-[16px] border border-slate-800 bg-slate-950/70 p-3.5 shadow-inner font-mono text-[10px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <IoLockClosedOutline />
                  ED25519 ASYMMETRIC KEY
                </span>
                <span className="text-emerald-400 font-bold">VALIDATED</span>
              </div>
              <div className="mt-2 truncate text-slate-500 text-[9px]">
                PUB: 0x9f1a8c42...78d2b63e
              </div>
              <div className="text-slate-500 text-[9px]">
                NONCE: #08942 // REPLAY PROTECTED
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Banner */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className={`rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${theme.statusBadge}`}>
              {theme.statusText}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            BASECAMP TELEMETRY UPTIME: <span className="text-slate-200 font-bold">99.98%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. Main Senior-Grade Landing Page
   ========================================================================= */
export default function Landing() {
  const { darkMode, toggleTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState(null);
  const [simMode, setSimMode] = useState("normal"); // normal | impact | sos
  const [simTimer, setSimTimer] = useState(30);
  const [cursorPos, setCursorPos] = useState({ x: 400, y: 300 });

  useEffect(() => {
    const handleMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Simulator Countdown
  useEffect(() => {
    let interval;
    if (simMode === "impact") {
      setSimTimer(30);
      interval = setInterval(() => {
        setSimTimer((prev) => {
          if (prev <= 1) {
            setSimMode("sos");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simMode]);

  const faqs = [
    {
      q: "Does TrailGuard require recurring cellular subscription fees?",
      a: "No. TrailGuard operates over open-standard long-range LoRa radio (433/868/915 MHz ISM spectrum) and offline multi-constellation satellite GPS. It transmits directly to basecamp monitoring hubs and peer wearables with zero monthly cell fees.",
    },
    {
      q: "How does the on-device Edge Risk Engine eliminate false fall alarms?",
      a: "The ESP32-S3 firmware evaluates a 3-stage kinematic vector heuristic: micro-freefall (<0.5g), instantaneous impact shock (>3.0g), and post-impact repose with biomechanical orientation change. A 30-second haptic cancel timer ensures false trips from dropped packs are dismissed before radio broadcast.",
    },
    {
      q: "What happens if a hiker's companion phone battery dies?",
      a: "The wrist wearable operates completely autonomously. Even if the paired phone is depleted or damaged, the hardware node continues acquiring satellite coordinates, monitoring pulse oximetry, and broadcasting emergency packets over LoRa.",
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
    <div className="relative min-h-screen bg-[#04080F] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Topographic Terrain Canvas (Living High-End Background) */}
      <TopographicCanvas themeMode="dark" accent="#06B6D4" />

      {/* Dynamic Cursor Spotlight Beam */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(6, 182, 212, 0.08), transparent 75%)`,
        }}
      />

      {/* =====================================================================
          1. STICKY TACTICAL GLASS NAVBAR
          ===================================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#04080F]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-cyan-400/30 bg-cyan-500/15 text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform duration-300 group-hover:scale-105">
              🛡
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                TRAIL<span className="text-cyan-400 font-extrabold">GUARD</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                SWAAS // AUTONOMOUS SAFETY
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-mono uppercase tracking-wider text-slate-400 md:flex">
            <a href="#mission" className="transition hover:text-cyan-300">
              01. MISSION
            </a>
            <a href="#hardware" className="transition hover:text-cyan-300">
              02. SENSOR ARRAY
            </a>
            <a href="#simulator" className="transition hover:text-cyan-300">
              03. FLIGHT SIMULATOR
            </a>
            <a href="#privacy" className="transition hover:text-cyan-300">
              04. PRIVACY ARCHITECTURE
            </a>
            <a href="#faq" className="transition hover:text-cyan-300">
              05. FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-[12px] border border-slate-700/80 bg-slate-900/60 px-4 py-2 font-mono text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white sm:inline-block"
            >
              OPERATOR LOGIN
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-[12px] bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:shadow-[0_0_28px_rgba(6,182,212,0.6)] active:scale-[0.98]"
            >
              <span>LAUNCH MISSION</span>
              <IoArrowForwardOutline className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO: CINEMATIC AAA GAME COMMAND CENTER
          ===================================================================== */}
      <section className="relative z-20 px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Tactical Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 font-mono text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span>OFF-GRID SATELLITE & LORA // ZERO CELLULAR DEPENDENCY</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl font-sans uppercase">
            15 Kilometers From Cell Service.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              One Autonomous Lifeline.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
            TrailGuard is an off-grid smart wearable safety system engineered for extreme wilderness.
            Featuring continuous optical photoplethysmography, 6-axis impact vector recognition,
            and 15 km LoRa mesh beaconing with fail-closed cryptographic telemetry.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-[14px] bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-7 py-4 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.45)] transition hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] active:scale-[0.99]"
            >
              <span>ACCESS WEB DASHBOARD</span>
              <IoArrowForwardOutline className="h-4 w-4" />
            </Link>

            <a
              href="#simulator"
              className="flex items-center gap-2 rounded-[14px] border border-slate-700 bg-slate-900/80 px-6 py-4 text-sm font-semibold text-slate-200 shadow-sm transition hover:border-cyan-400 hover:text-cyan-300 active:scale-[0.99]"
            >
              <IoFlashOutline className="text-amber-400" />
              <span>TEST-DRIVE SIMULATOR</span>
            </a>
          </div>

          {/* Senior Telemetry Metrics Ribbon */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-8 sm:grid-cols-4 font-mono">
            <div className="rounded-[16px] border border-slate-800/60 bg-slate-950/40 p-4">
              <div className="text-3xl font-extrabold text-cyan-400">15.0 KM</div>
              <div className="mt-1 text-[11px] text-slate-400">LORA SX1278 RADIUS</div>
            </div>
            <div className="rounded-[16px] border border-slate-800/60 bg-slate-950/40 p-4">
              <div className="text-3xl font-extrabold text-amber-400">&lt;500 MS</div>
              <div className="mt-1 text-[11px] text-slate-400">IMPACT KINEMATICS</div>
            </div>
            <div className="rounded-[16px] border border-slate-800/60 bg-slate-950/40 p-4">
              <div className="text-3xl font-extrabold text-emerald-400">48.0 HR</div>
              <div className="mt-1 text-[11px] text-slate-400">EXPEDITION BATTERY</div>
            </div>
            <div className="rounded-[16px] border border-slate-800/60 bg-slate-950/40 p-4">
              <div className="text-3xl font-extrabold text-purple-400">0.00 BYTES</div>
              <div className="mt-1 text-[11px] text-slate-400">PASSIVE CLOUD LEAK</div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            HERO INSTRUMENT: 3D INTERACTIVE TACTICAL CONSOLE
            =================================================================== */}
        <div className="mx-auto mt-16 max-w-5xl">
          <GameTacticalConsole cursorVector={cursorPos} currentMode={simMode} />
        </div>
      </section>

      {/* =====================================================================
          3. HARDWARE SPECIFICATIONS: BENTO TACTICAL MATRIX
          ===================================================================== */}
      <section id="hardware" className="relative z-20 border-t border-slate-800/80 bg-[#060D17]/80 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              // SECTION 02: INTEGRATED HARDWARE
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl font-sans uppercase">
              Mission-Critical Sensor Array
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-slate-400 sm:text-sm">
              Manufactured with aviation-grade components running deterministic FreeRTOS real-time execution.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: MAX30100 */}
            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-red-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-red-500/10 text-red-500 text-xl border border-red-500/20">
                <IoPulseOutline />
              </div>
              <h3 className="mt-5 text-lg font-bold font-sans uppercase text-slate-100">
                MAX30100 Pulse Oximeter
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Integrated dual-wavelength pulse rate and oxygen saturation sensor. Monitors acute hypoxia, respiratory fatigue, and cardiac distress at altitude.
              </p>
              <div className="mt-5 pt-3 border-t border-slate-900 font-mono text-[10px] text-cyan-400">
                BUS: I2C // SAMPLING: 100HZ // 16-BIT ADC
              </div>
            </div>

            {/* Card 2: MPU-6050 */}
            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-amber-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-amber-500/10 text-amber-500 text-xl border border-amber-500/20">
                <IoSpeedometerOutline />
              </div>
              <h3 className="mt-5 text-lg font-bold font-sans uppercase text-slate-100">
                MPU-6050 6-Axis Motion IMU
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Tri-axial accelerometer and gyroscope calculating real-time orientation quaternions. Detects violent slips, cliff tumbles, and post-fall stillness.
              </p>
              <div className="mt-5 pt-3 border-t border-slate-900 font-mono text-[10px] text-amber-400">
                RANGE: ±16G // GYRO: ±2000°/S // WAKE-ON-MOTION
              </div>
            </div>

            {/* Card 3: SX1278 LoRa */}
            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-cyan-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-cyan-500/10 text-cyan-400 text-xl border border-cyan-500/20">
                <RiSignalTowerLine />
              </div>
              <h3 className="mt-5 text-lg font-bold font-sans uppercase text-slate-100">
                SX1278 LoRa Transceiver
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Ultra-long-range spread spectrum RF transceiver delivering telemetry over 15 kilometers through heavy alpine forest and deep canyon topography.
              </p>
              <div className="mt-5 pt-3 border-t border-slate-900 font-mono text-[10px] text-cyan-400">
                FREQ: 433 MHZ ISM // POWER: +20 DBM // RANGE: 15 KM
              </div>
            </div>

            {/* Card 4: NEO-6M GPS */}
            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-emerald-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-emerald-500/10 text-emerald-400 text-xl border border-emerald-500/20">
                <IoCompassOutline />
              </div>
              <h3 className="mt-5 text-lg font-bold font-sans uppercase text-slate-100">
                NEO-6M Satellite Receiver
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                50-channel GPS engine with precision geodetic fix. Broadcasts latitude, longitude, and barometric elevation directly in the emergency rescue packet.
              </p>
              <div className="mt-5 pt-3 border-t border-slate-900 font-mono text-[10px] text-emerald-400">
                CHANNELS: 50 // SENSITIVITY: -161 DBM // ACC: ±2.5M
              </div>
            </div>

            {/* Card 5: BME280 */}
            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-sky-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-sky-500/10 text-sky-400 text-xl border border-sky-500/20">
                <IoThermometerOutline />
              </div>
              <h3 className="mt-5 text-lg font-bold font-sans uppercase text-slate-100">
                BME280 Atmospheric Sensor
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Precision barometric air pressure, temperature, and relative humidity monitoring for rapid storm detection and barometric altitude compensation.
              </p>
              <div className="mt-5 pt-3 border-t border-slate-900 font-mono text-[10px] text-sky-400">
                PRESSURE: 300–1100 HPA // RES: 0.18 PA // TEMP: ±0.5°C
              </div>
            </div>

            {/* Card 6: ESP32-S3 */}
            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-purple-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-purple-500/10 text-purple-400 text-xl border border-purple-500/20">
                <RiCpuLine />
              </div>
              <h3 className="mt-5 text-lg font-bold font-sans uppercase text-slate-100">
                ESP32-S3 Dual-Core SOC
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                240 MHz dual-core Xtensa processor with vector instructions for local machine learning risk models and hardware-accelerated Ed25519 cryptography.
              </p>
              <div className="mt-5 pt-3 border-t border-slate-900 font-mono text-[10px] text-purple-400">
                CORE: 240 MHZ // CRYPTO: ED25519/AES // FREERTOS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. INTERACTIVE FLIGHT SIMULATOR (TEST-DRIVE WORKFLOW)
          ===================================================================== */}
      <section id="simulator" className="relative z-20 border-t border-slate-800/80 bg-[#04080F] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
              // SECTION 03: LIVE TEST SUITE
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl font-sans uppercase">
              Emergency Workflow Simulator
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-slate-400 sm:text-sm">
              Trigger real-time incident states to test haptic cancel countdowns and encrypted LoRa emergency broadcasts.
            </p>
          </div>

          <div className="mt-12 rounded-[24px] border-2 border-slate-800 bg-slate-950/90 p-6 shadow-2xl sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-6 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSimMode("normal")}
                className={`rounded-[12px] px-4 py-2.5 font-bold transition ${
                  simMode === "normal"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                MODE 01: NORMAL EXPEDITION
              </button>
              <button
                type="button"
                onClick={() => setSimMode("impact")}
                className={`rounded-[12px] px-4 py-2.5 font-bold transition ${
                  simMode === "impact"
                    ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse"
                    : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                MODE 02: HIGH G-FORCE FALL (4.82G)
              </button>
              <button
                type="button"
                onClick={() => setSimMode("sos")}
                className={`rounded-[12px] px-4 py-2.5 font-bold transition ${
                  simMode === "sos"
                    ? "bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-bounce"
                    : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                MODE 03: LORA SOS BROADCAST
              </button>
            </div>

            <div className="mt-6 rounded-[16px] border border-slate-800 bg-black/60 p-6 font-mono">
              {simMode === "normal" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-2xl font-bold border border-cyan-500/30">
                    ✓
                  </div>
                  <h4 className="mt-4 text-base font-bold text-slate-100">SYSTEM STATE: NOMINAL</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Local SQLite buffer logging continuous 1-second cadence. Zero packets leaving the device.
                  </p>
                  <div className="mt-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-xs text-cyan-300">
                    HEART RATE: 74 BPM // G-FORCE: 1.01G // LORA: STANDBY // CLOUD: DISCONNECTED
                  </div>
                </div>
              )}

              {simMode === "impact" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-2xl font-bold border border-amber-500/40 animate-pulse">
                    ⚠️
                  </div>
                  <h4 className="mt-4 text-base font-bold text-amber-400">CRITICAL FALL DETECTED (4.82G SPIKE)</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Wearable initiated a 30-second haptic wrist alarm. Hiker can tap wrist to dismiss if safe.
                  </p>
                  <div className="mt-4 inline-block rounded-full border border-amber-500/50 bg-amber-500/15 px-5 py-1.5 text-xs font-bold text-amber-300">
                    HAPTIC COUNTDOWN: 00:{simTimer < 10 ? `0${simTimer}` : simTimer} REMAINING
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setSimMode("normal")}
                      className="rounded-[10px] bg-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/30 border border-amber-500/40"
                    >
                      I AM UNHURT (DISMISS ALARM)
                    </button>
                  </div>
                </div>
              )}

              {simMode === "sos" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-500 text-2xl font-bold border border-red-500/50">
                    🚨
                  </div>
                  <h4 className="mt-4 text-base font-bold text-red-500">LORA EMERGENCY BURST BROADCASTING</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Long-range RF beacon dispatched to Search and Rescue basecamps with validated cryptographic signature.
                  </p>
                  <div className="mt-4 rounded-[12px] border border-red-500/40 bg-red-950/20 p-4 text-left text-xs text-red-400 space-y-1">
                    <div>PACKET_ID: 0xTG-EMERG-8921 // CHECKSUM: 0xE42A</div>
                    <div>COORDINATES: 20.29614° N, 85.82452° E (ELEV: +1,842M)</div>
                    <div>VITALS: HR 148 BPM // SPO2 91% // HYPOXIC SHOCK</div>
                    <div>SIGNATURE: ED25519 HARDWARE CHIP VALIDATED</div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setSimMode("normal")}
                      className="rounded-[10px] bg-red-500/20 px-4 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/30 border border-red-500/40"
                    >
                      RESET SIMULATOR TO STANDBY
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. ZERO-TOLERANCE PRIVACY INVARIANTS
          ===================================================================== */}
      <section id="privacy" className="relative z-20 border-t border-slate-800/80 bg-[#060D17]/80 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              // SECTION 04: SECURITY INVARIANTS
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl font-sans uppercase">
              Privacy By Architecture
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Commercial fitness trackers monetize your heartbeats. TrailGuard is engineered as a safety instrument with zero continuous cloud lakes.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-cyan-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-cyan-500/10 text-cyan-400 text-xl border border-cyan-500/20">
                <IoLockClosedOutline />
              </div>
              <h3 className="mt-5 text-base font-bold font-sans uppercase text-slate-100">
                Invariant 1: Local-First Storage
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Continuous vitals and location samples remain exclusively on your companion device in an encrypted 7-day rolling SQLite buffer. Never automatically uploaded to any cloud server.
              </p>
            </div>

            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-emerald-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-emerald-500/10 text-emerald-400 text-xl border border-emerald-500/20">
                <IoShieldCheckmarkOutline />
              </div>
              <h3 className="mt-5 text-base font-bold font-sans uppercase text-slate-100">
                Invariant 2: Emergency-Bounded Sharing
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Telemetry leaves your personal device and enters the cloud backend only during an active authorized emergency session, bounded to at most the preceding 6 hours.
              </p>
            </div>

            <div className="rounded-[22px] border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-purple-500/40 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-purple-500/10 text-purple-400 text-xl border border-purple-500/20">
                <IoHardwareChipOutline />
              </div>
              <h3 className="mt-5 text-base font-bold font-sans uppercase text-slate-100">
                Invariant 4: Ed25519 Signatures
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Hardware nodes authenticate every packet using asymmetric Ed25519 digital signatures. Nonce replay tracking and fail-closed audit logs prevent counterfeit sensor feeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FAQ ACCORDION
          ===================================================================== */}
      <section id="faq" className="relative z-20 border-t border-slate-800/80 bg-[#04080F] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              // SECTION 05: DOCUMENTATION & FAQS
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl font-sans uppercase">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 space-y-3 font-sans">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-[16px] border border-slate-800 bg-slate-950/70 transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-bold text-slate-200 transition hover:text-cyan-400"
                  >
                    <span>{faq.q}</span>
                    <IoChevronDownOutline
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 text-cyan-400 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-900 p-5 text-xs leading-relaxed text-slate-400 sm:text-sm">
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
          7. FINAL TACTICAL FOOTER CTA
          ===================================================================== */}
      <footer className="relative z-20 border-t border-slate-800/80 bg-[#020509] py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-3xl font-extrabold tracking-tight sm:text-5xl font-sans uppercase">
            Ready to Navigate the Alpine Wilderness?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-xs text-slate-400 sm:text-sm font-sans">
            Connect your ESP32-S3 wearable node, initialize local-first telemetry, and step beyond cellular range with complete confidence.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-[14px] bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-7 py-4 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition hover:shadow-[0_0_35px_rgba(6,182,212,0.65)]"
            >
              <span>ENTER MISSION DASHBOARD</span>
              <IoArrowForwardOutline className="h-4 w-4" />
            </Link>

            <Link
              to="/register"
              className="rounded-[14px] border border-slate-700 bg-slate-900 px-7 py-4 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              CREATE OPERATOR ACCOUNT
            </Link>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 font-mono text-xs text-slate-500 sm:flex-row">
            <div>© {new Date().getFullYear()} TRAILGUARD (SWAAS). ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-5">
              <Link to="/about" className="hover:text-slate-300">
                SYSTEM ARCHITECTURE
              </Link>
              <Link to="/login" className="hover:text-slate-300">
                OPERATOR LOGIN
              </Link>
              <a href="#privacy" className="hover:text-slate-300">
                PRIVACY INVARIANTS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
