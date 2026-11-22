import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import VideoAmbient from "../components/common/VideoAmbient";
import loginBg from "../assets/images/login-background.webp";
import sarHelicopterImg from "../assets/images/sar-helicopter.webp";
import {
  IoShieldCheckmarkOutline,
  IoPulseOutline,
  IoRadioOutline,
  IoCompassOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoArrowForwardOutline,
  IoHardwareChipOutline,
  IoChevronDownOutline,
  IoLockClosedOutline,
  IoSpeedometerOutline,
  IoLayersOutline,
  IoThermometerOutline,
  IoWifiOutline,
  IoVideocamOutline,
  IoFlashOutline,
  IoAlertCircleOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoPaperPlaneOutline,
  IoCloseOutline,
} from "react-icons/io5";

/* =========================================================================
   1. GLOBAL LIVING ATMOSPHERE CANVAS (FULL PAGE CONTINUOUS PARTICLES & FOG)
   ========================================================================= */
function GlobalLivingAtmosphereCanvas({ isDark = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      t += 0.015;

      ctx.clearRect(0, 0, width, height);

      // Living ambient diffuse glow orbs that gently drift and illuminate the canvas
      const orb1X = width * 0.25 + Math.sin(t * 0.4) * 90;
      const orb1Y = height * 0.25 + Math.cos(t * 0.35) * 75;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 15, orb1X, orb1Y, 480);
      grad1.addColorStop(0, isDark ? "rgba(0, 212, 255, 0.14)" : "rgba(14, 165, 233, 0.05)");
      grad1.addColorStop(0.5, isDark ? "rgba(0, 212, 255, 0.04)" : "rgba(14, 165, 233, 0.02)");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.78 + Math.cos(t * 0.35) * 100;
      const orb2Y = height * 0.65 + Math.sin(t * 0.45) * 85;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 20, orb2X, orb2Y, 520);
      grad2.addColorStop(0, isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(59, 130, 246, 0.04)");
      grad2.addColorStop(0.5, isDark ? "rgba(37, 99, 235, 0.03)" : "rgba(59, 130, 246, 0.015)");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Third ambient pool in deep center
      const orb3X = width * 0.5 + Math.sin(t * 0.25) * 120;
      const orb3Y = height * 0.85 + Math.cos(t * 0.3) * 60;
      const grad3 = ctx.createRadialGradient(orb3X, orb3Y, 10, orb3X, orb3Y, 450);
      grad3.addColorStop(0, isDark ? "rgba(0, 212, 255, 0.10)" : "rgba(56, 189, 248, 0.035)");
      grad3.addColorStop(1, "transparent");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // Living Topographic Contour Flow Waves across the entire viewport
      const drawContour = (baseY, freq1, freq2, amp1, amp2, speed1, speed2, strokeColor, lineWidth) => {
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= width; x += 30) {
          const y =
            baseY +
            Math.sin(x * freq1 + t * speed1) * amp1 +
            Math.cos(x * freq2 - t * speed2) * amp2;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      };

      drawContour(
        height * 0.35,
        0.002,
        0.005,
        28,
        18,
        0.3,
        0.2,
        isDark ? "rgba(0, 212, 255, 0.08)" : "rgba(14, 116, 144, 0.05)",
        1.2
      );
      drawContour(
        height * 0.6,
        0.003,
        0.006,
        35,
        22,
        0.4,
        0.25,
        isDark ? "rgba(56, 189, 248, 0.07)" : "rgba(5, 150, 105, 0.04)",
        1.4
      );
      drawContour(
        height * 0.85,
        0.0025,
        0.007,
        30,
        20,
        0.35,
        0.3,
        isDark ? "rgba(37, 99, 235, 0.07)" : "rgba(37, 99, 235, 0.04)",
        1.2
      );

      // Subtle traveling tactical laser scan across the whole page
      const pageScanY = ((t * 40) % (height + 200)) - 100;
      if (pageScanY >= 0 && pageScanY <= height) {
        const scanGrad = ctx.createLinearGradient(0, pageScanY - 20, 0, pageScanY + 20);
        scanGrad.addColorStop(0, "transparent");
        scanGrad.addColorStop(0.5, isDark ? "rgba(0, 212, 255, 0.06)" : "rgba(6, 182, 212, 0.03)");
        scanGrad.addColorStop(1, "transparent");
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, pageScanY - 20, width, 40);
      }
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full object-cover" />
    </div>
  );
}

/* =========================================================================
   2. 21ST.DEV SIGNATURE BORDER BEAM CONTAINER
   ========================================================================= */
function BorderBeamCard({ children, className = "", isDark = true }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-[1px] transition-all duration-300 ${className}`}
    >
      {/* 21st.dev Conic Gradient Spinning Beam */}
      <div
        className={`absolute -inset-[150%] animate-border-beam pointer-events-none opacity-60 ${
          isDark
            ? "bg-[conic-gradient(from_0deg,transparent_0_330deg,#38BDF8_360deg)]"
            : "bg-[conic-gradient(from_0deg,transparent_0_330deg,#0284C7_360deg)]"
        }`}
      />
      {/* Card Content Surface */}
      <div
        className={`relative h-full w-full rounded-[23px] backdrop-blur-2xl p-6 sm:p-7 ${
          isDark
            ? "bg-[#0b0d14]/90 text-slate-100 shadow-2xl"
            : "bg-white/95 text-slate-900 shadow-xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================================
   3. SEAMLESS INFINITE 3D ALPINE FLIGHT VIDEO ENGINE (PERFECT CONTINUOUS LOOP)
   ========================================================================= */
function SeamlessAlpineFlightCanvas({ isDark = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth || 1200;
      height = canvas.height = canvas.parentElement.clientHeight || 650;
    };
    window.addEventListener("resize", handleResize);

    const cols = 40;
    const rows = 30;
    const rowSpacing = 24;
    let flightTime = 0;
    const speed = 0.85; // smooth continuous forward units

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      flightTime += speed;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.42;
      const fov = 320;

      // Atmospheric Sky Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isDark) {
        bgGrad.addColorStop(0, "#030407");
        bgGrad.addColorStop(0.48, "#080c18");
        bgGrad.addColorStop(1, "#030408");
      } else {
        bgGrad.addColorStop(0, "#f0f9ff");
        bgGrad.addColorStop(0.45, "#e0f2fe");
        bgGrad.addColorStop(1, "#f8fafc");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant Alpine Peaks Silhouette
      ctx.beginPath();
      ctx.moveTo(0, cy - 20);
      const peaks = [
        [0.05, cy - 35],
        [0.18, cy - 65],
        [0.32, cy - 40],
        [0.5, cy - 90], // Mont Blanc Summit
        [0.68, cy - 50],
        [0.82, cy - 75],
        [0.92, cy - 35],
        [1.0, cy - 20],
      ];
      peaks.forEach(([px, py]) => ctx.lineTo(px * width, py));
      ctx.lineTo(width, cy);
      ctx.lineTo(0, cy);
      ctx.fillStyle = isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(203, 213, 225, 0.65)";
      ctx.fill();

      // Mathematically flawless, continuous infinite terrain flyover:
      // The camera advances continuously along cameraZ in world coordinates.
      // Every physical terrain row has a fixed worldRow index, so mountains never mutate or jump.
      const cameraZ = flightTime;
      const baseWorldRow = Math.floor(cameraZ / rowSpacing);
      const points = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        const worldRow = baseWorldRow + r;
        // True camera depth (decreases smoothly with cameraZ)
        const z = worldRow * rowSpacing - cameraZ + 12;
        if (z <= 2) continue;

        // Fixed world coordinates for this physical terrain row
        const worldZ = worldRow * 0.42;

        for (let c = 0; c < cols; c++) {
          const x = (c - cols / 2) * 28;
          const flankDist = Math.abs(c - cols / 2) / (cols / 2);
          const flankElev = Math.pow(flankDist, 2.2) * 280;

          // Stable alpine terrain elevation locked to physical world coordinate
          const wave =
            Math.sin(c * 0.35 + worldZ * 3.5) * 25 +
            Math.cos(c * 0.22 - worldZ * 2.8) * 30;
          const y = flankElev + wave - 65;

          const sx = cx + (x / z) * fov;
          const sy = cy + (y / z) * fov;

          // Smooth depth attenuation that reaches exactly 0 at horizon and near camera (zero pop)
          const normZ = z / (rows * rowSpacing);
          const depthAlpha = Math.sin(Math.max(0, Math.min(Math.PI, normZ * Math.PI)));

          points[r][c] = { sx, sy, depthAlpha, z, worldRow };
        }
      }

      // Draw Horizontal Terrain Contours
      for (let r = rows - 1; r >= 1; r--) {
        if (!points[r] || !points[r][0]) continue;
        const alpha = points[r][0]?.depthAlpha || 0;
        if (alpha <= 0.02) continue;

        ctx.beginPath();
        let started = false;
        for (let c = 0; c < cols; c++) {
          const pt = points[r][c];
          if (!pt || pt.sx < -100 || pt.sx > width + 100) continue;
          if (!started) {
            ctx.moveTo(pt.sx, pt.sy);
            started = true;
          } else {
            ctx.lineTo(pt.sx, pt.sy);
          }
        }
        ctx.strokeStyle = isDark
          ? `rgba(56, 189, 248, ${alpha * 0.4})`
          : `rgba(14, 116, 144, ${alpha * 0.32})`;
        ctx.lineWidth = Math.max(0.75, alpha * 2.2);
        ctx.stroke();
      }

      // Draw Longitudinal Flight Vectors
      for (let c = 0; c < cols; c += 2) {
        ctx.beginPath();
        let started = false;
        for (let r = rows - 1; r >= 1; r--) {
          const pt = points[r]?.[c];
          if (!pt || pt.sx < -100 || pt.sx > width + 100) continue;
          if (!started) {
            ctx.moveTo(pt.sx, pt.sy);
            started = true;
          } else {
            ctx.lineTo(pt.sx, pt.sy);
          }
        }
        const flank = Math.abs(c - cols / 2) / (cols / 2);
        ctx.strokeStyle = isDark
          ? `rgba(6, 182, 212, ${0.12 + flank * 0.22})`
          : `rgba(2, 132, 199, ${0.1 + flank * 0.18})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // Continuous Scanning LiDAR Laser Line
      const laserCycle = (flightTime * 0.015) % 1;
      const targetZ = (0.2 + laserCycle * 0.6) * (rows * rowSpacing);
      let bestRowIndex = -1;
      let minDiff = 999999;
      for (let r = 0; r < rows; r++) {
        const pt = points[r]?.[Math.floor(cols / 2)];
        if (pt && pt.depthAlpha > 0.05) {
          const diff = Math.abs(pt.z - targetZ);
          if (diff < minDiff) {
            minDiff = diff;
            bestRowIndex = r;
          }
        }
      }

      if (bestRowIndex !== -1 && points[bestRowIndex]) {
        ctx.beginPath();
        let started = false;
        for (let c = 0; c < cols; c++) {
          const pt = points[bestRowIndex][c];
          if (!pt || pt.sx < -100 || pt.sx > width + 100) continue;
          if (!started) {
            ctx.moveTo(pt.sx, pt.sy);
            started = true;
          } else {
            ctx.lineTo(pt.sx, pt.sy);
          }
        }
        ctx.strokeStyle = isDark ? "rgba(249, 115, 22, 0.85)" : "rgba(234, 88, 12, 0.75)";
        ctx.lineWidth = 2.4;
        ctx.shadowColor = "#F97316";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full object-cover" />
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-t from-[#06070a] via-transparent to-[#06070a]/70"
            : "bg-gradient-to-t from-[#F8FAFC] via-transparent to-[#F8FAFC]/70"
        }`}
      />
    </div>
  );
}

/* =========================================================================
   4. 21ST.DEV MARQUEE TICKER (SILKY SMOOTH REALTIME TELEMETRY FEED)
   ========================================================================= */
function TelemetryMarqueeStrip({ isDark = true }) {
  const items = [
    "🛰 GNSS FIX: 12-SATELLITE LOCK · LAT 45.8326° N, LON 6.8652° E",
    "📡 LORA 868MHz MESH: +20dBm · 15 KM MOUNTAIN REACH",
    "⚡ KINEMATIC THRESHOLD: <3.0G IMPACT ENGINE ACTIVE",
    "❤️ OPTICAL PPG: 74 BPM · 99% SPO2 · ZERO-CLOUD STREAMING",
    "🏔 ELEVATION BAROMETER: 2,840M · 712 hPa",
    "🔒 PRIVACY INVARIANT: 7-DAY ROLLING LOCAL SQLITE BUFFER",
    "🛡 FAIL-CLOSED AUDIT: ED25519 ASYMMETRIC DEVICE SIGNATURES",
  ];

  return (
    <div
      className={`relative overflow-hidden border-y py-3 font-mono text-xs ${
        isDark
          ? "border-white/[0.08] bg-[#070910] text-slate-400"
          : "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      <div className="animate-marquee-scroll flex gap-8 whitespace-nowrap">
        {[...items, ...items].map((text, idx) => (
          <div key={`${text}-${idx}`} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="font-medium tracking-wider">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   5. 21ST.DEV ANIMATED BEAM MULTI-NODE MESH NETWORK DIAGRAM
   ========================================================================= */
function AnimatedBeamMeshDiagram({ isDark = true }) {
  return (
    <div
      className={`mt-12 rounded-3xl border p-6 sm:p-9 backdrop-blur-2xl ${
        isDark ? "border-white/[0.08] bg-[#0c0d14]/85 shadow-2xl" : "border-slate-200 bg-white/90 shadow-xl"
      }`}
    >
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-3 py-1 font-mono text-xs text-cyan-400 mb-2">
          <IoWifiOutline className="h-3.5 w-3.5" />
          <span>Multi-Hop Radio Mesh Network</span>
        </div>
        <h3 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Decentralized LoRa Mesh Signal Propagation
        </h3>
        <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Emergency telemetry travels along physical radio beams from valley ravines over mountain ridges to rescue headquarters.
        </p>
      </div>

      {/* Visual Multi-Node Beam Flow */}
      <div className="relative mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Node 1: Hiker Wearable */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <IoHardwareChipOutline className="h-9 w-9 text-cyan-400" />
            <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-slate-950 animate-ping" />
          </div>
          <div className="mt-3 font-semibold text-sm text-white">ESP32-S3 Wearable</div>
          <div className="font-mono text-xs text-cyan-400">Origin: Deep Ravine</div>
          <div className="mt-1 font-mono text-[10px] text-slate-400">868MHz · 64-byte payload</div>
        </div>

        {/* Node 2: Ridge Drone / Repeater */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <IoRadioOutline className="h-9 w-9 text-amber-400" />
            <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-amber-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <div className="mt-3 font-semibold text-sm text-white">Alpine Ridge Relay</div>
          <div className="font-mono text-xs text-amber-400">Hop 02 · 15 km Line-of-Sight</div>
          <div className="mt-1 font-mono text-[10px] text-slate-400">Zero Cellular Required</div>
        </div>

        {/* Node 3: SAR Basecamp Command */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <IoShieldCheckmarkOutline className="h-9 w-9 text-emerald-400" />
            <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>
          <div className="mt-3 font-semibold text-sm text-white">Basecamp Command HQ</div>
          <div className="font-mono text-xs text-emerald-400">Hop 03 · Rescue Dispatch</div>
          <div className="mt-1 font-mono text-[10px] text-slate-400">Offline PWA Live Map</div>
        </div>

        {/* Animated Connecting SVG Beams */}
        <svg
          className="pointer-events-none absolute inset-0 hidden md:block h-full w-full"
          viewBox="0 0 900 160"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 180 80 L 410 80"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="3"
            strokeDasharray="8 8"
            className="animate-beam-pulse"
          />
          <path
            d="M 490 80 L 720 80"
            stroke="rgba(245, 158, 11, 0.4)"
            strokeWidth="3"
            strokeDasharray="8 8"
            className="animate-beam-pulse"
          />
        </svg>
      </div>
    </div>
  );
}

/* =========================================================================
   6. 21ST.DEV INTERACTIVE BENTO GRID (WITH DYNAMIC SENSOR VISUALIZERS)
   ========================================================================= */
function InteractiveBentoGrid({ isDark = true }) {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Featured Bento 1: Optical PPG Pulse Vitals */}
      <div className="md:col-span-2 rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl border-white/[0.08] bg-[#0c0d14]/80 transition-all duration-300 hover:border-cyan-500/40">
        <div className="flex items-center justify-between font-mono text-xs text-emerald-400 border-b border-slate-800 pb-3">
          <span className="flex items-center gap-1.5">
            <IoPulseOutline className="h-4 w-4" />
            <span>MAX30100 Optical Biosensor</span>
          </span>
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5">
            Realtime 100Hz
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-xl font-semibold text-white tracking-tight">
              Cardiac Stress & Hypoxia Detection
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Continuously samples red (660nm) and infrared (880nm) photoplethysmogram waveforms to detect rapid tachycardia, bradycardia, and cold-induced hypothermia.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-black/60 p-4">
            <div className="flex items-center justify-between font-mono text-xs mb-2">
              <span className="text-slate-400">Optical Waveform</span>
              <span className="text-emerald-400 font-bold">74 BPM · 99% SpO2</span>
            </div>
            <div className="relative h-14 w-full overflow-hidden">
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
              <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-grid-scan" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Bento 2: LoRa SX1278 Sub-GHz Radio */}
      <div className="rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl border-white/[0.08] bg-[#0c0d14]/80 transition-all duration-300 hover:border-blue-500/40">
        <div className="flex items-center justify-between font-mono text-xs text-blue-400 border-b border-slate-800 pb-3">
          <span className="flex items-center gap-1.5">
            <IoRadioOutline className="h-4 w-4" />
            <span>SX1278 Transceiver</span>
          </span>
          <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5">
            15 km LOS
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-white tracking-tight">
            Sub-GHz Mesh Radio
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Operates on license-free 868MHz frequencies with +20dBm power, reaching through alpine pine canopy without cellular towers.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs">
            <span className="text-slate-400">Sensitivity:</span>
            <span className="text-cyan-300 font-bold">-148 dBm</span>
          </div>
        </div>
      </div>

      {/* Bento 3: MPU6050 6-DoF Kinematics */}
      <div className="rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl border-white/[0.08] bg-[#0c0d14]/80 transition-all duration-300 hover:border-cyan-500/40">
        <div className="flex items-center justify-between font-mono text-xs text-cyan-400 border-b border-slate-800 pb-3">
          <span className="flex items-center gap-1.5">
            <IoSpeedometerOutline className="h-4 w-4" />
            <span>MPU6050 Motion</span>
          </span>
          <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5">
            ±16g Range
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-white tracking-tight">
            Kinematic Fall Engine
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Detects freefall deceleration (&lt;0.2g), impact shock (&gt;3.0g), and post-impact repose angle to dismiss false trips.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs">
            <span className="text-slate-400">Current Shock:</span>
            <span className="text-emerald-400 font-bold">0.98g Nominal</span>
          </div>
        </div>
      </div>

      {/* Bento 4: NEO-6M Multi-GNSS Satellite */}
      <div className="rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl border-white/[0.08] bg-[#0c0d14]/80 transition-all duration-300 hover:border-amber-500/40">
        <div className="flex items-center justify-between font-mono text-xs text-amber-400 border-b border-slate-800 pb-3">
          <span className="flex items-center gap-1.5">
            <IoCompassOutline className="h-4 w-4" />
            <span>NEO-6M GNSS</span>
          </span>
          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5">
            50 Channel
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-white tracking-tight">
            High-Precision Satellite Lock
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Maintains continuous 2.5m accuracy even when hiking through deep granite ravines and dense cloud cover.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs">
            <span className="text-slate-400">Satellites Tracked:</span>
            <span className="text-amber-300 font-bold">12 Locked</span>
          </div>
        </div>
      </div>

      {/* Bento 5: ESP32-S3 Compute & Cryptography */}
      <div className="rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl border-white/[0.08] bg-[#0c0d14]/80 transition-all duration-300 hover:border-rose-500/40">
        <div className="flex items-center justify-between font-mono text-xs text-rose-400 border-b border-slate-800 pb-3">
          <span className="flex items-center gap-1.5">
            <IoLayersOutline className="h-4 w-4" />
            <span>ESP32-S3 Core</span>
          </span>
          <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5">
            240MHz
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold text-white tracking-tight">
            Hardware Flash Encryption
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Executes Ed25519 asymmetric signing and local SQLite retention directly on silicon with zero cloud telemetry leakage.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs">
            <span className="text-slate-400">Crypto Engine:</span>
            <span className="text-rose-300 font-bold">AES-256-GCM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   7. TACTICAL RADAR TERMINAL & RESCUE SIMULATOR (WITH ROTATING RADAR SWEEP)
   ========================================================================= */
function TacticalRadarTerminal({ isDark = true }) {
  const [simMode, setSimMode] = useState("normal"); // 'normal' | 'impact' | 'sos'
  const [simTimer, setSimTimer] = useState(30);

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

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 ${
        isDark ? "border-white/[0.08] bg-[#0c0d14]/85 shadow-2xl" : "border-slate-200 bg-white/90 shadow-xl"
      }`}
    >
      {/* Simulation Stage Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5 font-mono text-xs border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Incident Stage:</span>
          <span
            className={`rounded-full px-3 py-1 font-semibold text-[11px] ${
              simMode === "normal"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : simMode === "impact"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
                : "bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse"
            }`}
          >
            {simMode === "normal" && "Nominal Patrol"}
            {simMode === "impact" && `Fall Impact Detected (${simTimer}s Countdown)`}
            {simMode === "sos" && "Emergency SOS Broadcasting"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSimMode("normal")}
            className={`rounded-full px-3.5 py-1.5 font-medium transition cursor-pointer text-xs ${
              simMode === "normal"
                ? "bg-emerald-600 text-white shadow-sm"
                : isDark
                ? "border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900"
            }`}
          >
            Nominal
          </button>
          <button
            type="button"
            onClick={() => setSimMode("impact")}
            className={`rounded-full px-3.5 py-1.5 font-medium transition cursor-pointer text-xs ${
              simMode === "impact"
                ? "bg-amber-600 text-white shadow-sm"
                : isDark
                ? "border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900"
            }`}
          >
            Simulate Fall
          </button>
          <button
            type="button"
            onClick={() => setSimMode("sos")}
            className={`rounded-full px-3.5 py-1.5 font-medium transition cursor-pointer text-xs ${
              simMode === "sos"
                ? "bg-rose-600 text-white shadow-sm"
                : isDark
                ? "border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900"
            }`}
          >
            Emergency SOS
          </button>
        </div>
      </div>

      {/* Main Cockpit Grid */}
      <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Telemetry Console */}
        <div className="lg:col-span-6 space-y-5">
          {simMode === "normal" && (
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  All Sensors Nominal · Local Buffer Secure
                </span>
              </div>
              <p className={`mt-2.5 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Continuous biometric and spatial metrics are locked inside on-device SQLite. Background radio transmission is paused until an authorized emergency occurs.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 font-mono text-xs">
                <div className={`rounded-xl border p-3.5 ${isDark ? "border-slate-800/80 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}>
                  <div className="text-[10px] text-slate-500">HEART RATE</div>
                  <div className="mt-1 text-xl font-bold text-emerald-400">74 BPM</div>
                  <div className="text-[9px] text-slate-400">Optical PPG</div>
                </div>

                <div className={`rounded-xl border p-3.5 ${isDark ? "border-slate-800/80 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}>
                  <div className="text-[10px] text-slate-500">BLOOD SPO2</div>
                  <div className="mt-1 text-xl font-bold text-cyan-400">99%</div>
                  <div className="text-[9px] text-slate-400">Steady</div>
                </div>

                <div className={`rounded-xl border p-3.5 ${isDark ? "border-slate-800/80 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}>
                  <div className="text-[10px] text-slate-500">KINEMATICS</div>
                  <div className="mt-1 text-xl font-bold text-blue-400">0.98g</div>
                  <div className="text-[9px] text-slate-400">Rest Posture</div>
                </div>
              </div>
            </div>
          )}

          {simMode === "impact" && (
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="font-mono text-xs font-semibold text-amber-400">
                  3.84g Impact Shock · 30-Second Cancel Window
                </span>
              </div>
              <p className={`mt-2.5 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Kinematic shock exceeded 3.0g followed by horizontal repose. Wrist haptic alert active to allow conscious cancellation.
              </p>

              <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4">
                <div className="flex items-center justify-between font-mono text-xs text-amber-300">
                  <span>Haptic Cancel Timer:</span>
                  <span className="text-lg font-bold text-amber-400">{simTimer}s</span>
                </div>
                <div className="mt-2.5 w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(simTimer / 30) * 100}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setSimMode("normal")}
                    className="rounded-full bg-emerald-600 px-4 py-1.5 font-medium text-white hover:bg-emerald-500 cursor-pointer shadow-sm"
                  >
                    I&apos;m Okay (Cancel)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMode("sos")}
                    className="rounded-full bg-rose-600 px-4 py-1.5 font-medium text-white hover:bg-rose-500 cursor-pointer shadow-sm"
                  >
                    Dispatch Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {simMode === "sos" && (
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-mono text-xs font-semibold text-rose-400">
                  Emergency Beacon Active · LoRa Mesh Broadcasting
                </span>
              </div>
              <p className={`mt-2.5 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Emergency package transmitted with Ed25519 signature, satellite coordinates, and preceding 6-hour vital summary.
              </p>

              <div className="mt-5 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-950/20 px-3 py-2 text-rose-300">
                  <span>Coordinates:</span>
                  <span className="font-medium">45.8326° N, 6.8652° E</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-950/20 px-3 py-2 text-rose-300">
                  <span>Authentication:</span>
                  <span className="font-medium">Ed25519 Signature Verified</span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 px-5 py-2 font-mono text-xs font-semibold text-white shadow-md hover:shadow-rose-600/30"
                >
                  <span>Open Rescue Dashboard</span>
                  <IoArrowForwardOutline className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Tactical 360° Circular Radar Terminal */}
        <div className="lg:col-span-6 flex justify-center">
          <div
            className={`relative flex h-72 w-72 sm:h-80 sm:w-80 items-center justify-center rounded-full border shadow-xl overflow-hidden ${
              simMode === "normal"
                ? "border-emerald-500/30 bg-slate-950/90"
                : simMode === "impact"
                ? "border-amber-500/50 bg-slate-950/90 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
                : "border-rose-500/60 bg-slate-950/90 shadow-[0_0_28px_rgba(225,29,72,0.25)]"
            }`}
          >
            {/* Concentric Distance Rings */}
            <div className="absolute h-[85%] w-[85%] rounded-full border border-dashed border-emerald-500/15" />
            <div className="absolute h-[60%] w-[60%] rounded-full border border-emerald-500/20" />
            <div className="absolute h-[35%] w-[35%] rounded-full border border-emerald-500/25" />

            {/* Radar Crosshairs */}
            <div className="absolute inset-x-0 h-[1px] bg-emerald-500/15" />
            <div className="absolute inset-y-0 w-[1px] bg-emerald-500/15" />

            {/* Rotating 360° Radar Sweep Beam */}
            <div
              className={`absolute inset-0 animate-radar-sweep ${
                simMode === "normal"
                  ? "bg-gradient-to-tr from-emerald-500/15 via-transparent to-transparent"
                  : simMode === "impact"
                  ? "bg-gradient-to-tr from-amber-500/20 via-transparent to-transparent"
                  : "bg-gradient-to-tr from-rose-500/25 via-transparent to-transparent"
              }`}
            />

            {/* Wearable Node (Center) */}
            <div className="relative z-20 flex flex-col items-center">
              <span className={`relative flex h-3.5 w-3.5 ${simMode === "sos" ? "animate-pulse-beacon" : ""}`}>
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    simMode === "normal"
                      ? "bg-emerald-400 animate-ping"
                      : simMode === "impact"
                      ? "bg-amber-400 animate-ping"
                      : "bg-rose-500 animate-ping"
                  }`}
                />
                <span
                  className={`relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white ${
                    simMode === "normal"
                      ? "bg-emerald-500"
                      : simMode === "impact"
                      ? "bg-amber-500"
                      : "bg-rose-600"
                  }`}
                />
              </span>
              <span className="mt-1 font-mono text-[9px] text-white bg-slate-900/90 px-1.5 py-0.5 rounded border border-white/10">
                Hiker_01
              </span>
            </div>

            {/* Drone Relay Node */}
            <div className="absolute top-14 right-16 z-10 flex flex-col items-center font-mono text-[8px] text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="bg-slate-900/80 px-1 rounded mt-0.5">Ridge_Relay</span>
            </div>

            {/* SAR Basecamp Node */}
            <div className="absolute bottom-14 left-16 z-10 flex flex-col items-center font-mono text-[8px] text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="bg-slate-900/80 px-1 rounded mt-0.5">Basecamp_HQ</span>
            </div>

            <span className="absolute top-2.5 font-mono text-[8px] text-emerald-500/50">15 km Range</span>
            <span className="absolute bottom-2.5 font-mono text-[8px] text-emerald-500/50">LoRa Mesh</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   8.5. SWAAS PROBLEM VS SOLUTION SECTION (MISSION-CRITICAL BREAKDOWN)
   ========================================================================= */
function SwaasProblemSolutionSection({ isDark = true }) {
  return (
    <section
      id="problem-solution"
      className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
        isDark ? "border-white/[0.06] bg-[#070D1B]/80" : "border-slate-200/80 bg-slate-50/80"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 px-3.5 py-1 font-mono text-xs font-medium text-[#00D4FF] backdrop-blur-md">
            <IoAlertCircleOutline className="h-4 w-4" />
            <span>THE WILDERNESS SAFETY PROBLEM VS SOLUTION</span>
          </div>
          <h2
            className={`mt-3.5 text-2xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Why Traditional Distress Beacons Fail in the Field
          </h2>
          <p
            className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Commercial smartwatches and satellite trackers require manual button pushes, recurring subscriptions, or clear cell signals. SWAAS solves this with autonomous edge detection.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: The Critical Problem */}
          <div
            className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
              isDark
                ? "border-rose-500/20 bg-rose-950/10 shadow-[0_0_30px_rgba(244,63,94,0.06)]"
                : "border-rose-200 bg-rose-50/50"
            }`}
          >
            <div className="flex items-center gap-2.5 font-mono text-xs font-semibold text-rose-400">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span>THE VULNERABILITY · LEGACY SAFETY TOOLS</span>
            </div>
            <h3
              className={`mt-4 text-xl font-bold tracking-tight ${
                isDark ? "text-rose-100" : "text-rose-900"
              }`}
            >
              Minutes Lost When Consciousness Fails
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
              When an alpine operator or field engineer suffers impact trauma, manual SOS triggers cannot be pressed, and cellular dead zones silence companion phones.
            </p>

            <div className="mt-6 space-y-4 font-mono text-xs">
              <div className="flex items-start gap-3">
                <IoTimeOutline className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-rose-300">Unconscious Traumatic Falls:</span>
                  <span className="text-slate-400 ml-1.5">
                    Traditional SOS buttons require conscious human activation, causing hours of delay during head injury.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IoAlertCircleOutline className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-rose-300">100% Cellular Dependency:</span>
                  <span className="text-slate-400 ml-1.5">
                    Consumer wearables fail as soon as teams enter canyons, ridges, or deep timber beyond cellular coverage.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IoAlertCircleOutline className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-rose-300">False-Alarm Dispatch Costs:</span>
                  <span className="text-slate-400 ml-1.5">
                    Unfiltered accelerometers generate false helicopter dispatches, eroding rescue authority trust.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The SWAAS Autonomous Solution */}
          <div
            className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
              isDark
                ? "border-[#00D4FF]/30 bg-[#0A1224]/80 shadow-[0_0_35px_rgba(0,212,255,0.12)]"
                : "border-cyan-200 bg-cyan-50/50"
            }`}
          >
            <div className="flex items-center gap-2.5 font-mono text-xs font-semibold text-[#00D4FF]">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span>THE SWAAS ARCHITECTURE · PROVEN RESCUE OUTCOME</span>
            </div>
            <h3
              className={`mt-4 text-xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Under 60-Second Autonomous Dispatch
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
              SWAAS closes every gap with firmware-level intelligence: autonomous kinematic confirmation, peer-to-peer LoRa radio hops, and zero false alarms.
            </p>

            <div className="mt-6 space-y-4 font-mono text-xs">
              <div className="flex items-start gap-3">
                <IoCheckmarkCircleOutline className="h-4 w-4 text-[#00D4FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#00D4FF]">3-Stage Kinematic Engine:</span>
                  <span className="text-slate-300 ml-1.5">
                    Evaluates micro-freefall, &gt;3.0g shock impact, and horizontal repose before initiating dispatch.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IoCheckmarkCircleOutline className="h-4 w-4 text-[#00D4FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#00D4FF]">15 km Sub-GHz LoRa Mesh:</span>
                  <span className="text-slate-300 ml-1.5">
                    Emergency packets travel ridge-to-ridge across repeater drones directly to basecamp with zero cellular towers.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IoCheckmarkCircleOutline className="h-4 w-4 text-[#00D4FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#00D4FF]">30s Haptic Wrist Reversal:</span>
                  <span className="text-slate-300 ml-1.5">
                    Vibrating countdown allows conscious hikers to instantly cancel false trips with a single wrist tap.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   8.7. SAR MOUNTAIN EXTRACTION & AIRBORNE RAPID RESPONSE SECTION
   ========================================================================= */
function SarAirborneExtractionSection({ isDark = true }) {
  return (
    <section
      id="sar-extraction"
      className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
        isDark ? "border-white/[0.06] bg-[#060810]/70" : "border-slate-200/80 bg-slate-50/70"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-amber-400 font-medium">
            <IoShieldCheckmarkOutline className="h-4 w-4" />
            <span>Search & Rescue (SAR) Airborne Extraction</span>
          </div>
          <h2
            className={`mt-2.5 text-2xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Direct Handshake with Mountain Rescue Aviation
          </h2>
          <p
            className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            When an uncancelled fall occurs, TrailGuard dispatches cryptographic coordinates directly to regional emergency flight command with zero reliance on consumer cellular towers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Real Photograph with Taste-Skill Micro-Hover Zoom */}
          <div className="lg:col-span-7">
            <div
              className={`group relative overflow-hidden rounded-[var(--card-radius)] border backdrop-blur-2xl transition-all duration-500 ${
                isDark
                  ? "border-white/[0.08] bg-[#0c0d16]/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                  : "border-slate-200 bg-white/90 shadow-xl"
              }`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={sarHelicopterImg}
                  alt="Mountain Search and Rescue Tactical Helicopter"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060810] via-transparent to-transparent opacity-80" />

                {/* HUD Telemetry Tag */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-xs text-slate-200">
                  <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>AIRBORNE SAR UNIT · H145 T3 READY</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10 text-cyan-300">
                    <span>SECTOR 4 DESCENT // 60s ARRIVAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Specs List */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`rounded-[var(--radius-xl)] border p-5 backdrop-blur-xl transition-all ${
                isDark ? "border-white/[0.06] bg-[#0c0d16]/60" : "border-slate-200 bg-white/70"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs text-cyan-400 font-semibold">
                <span>01 · AUTONOMOUS DISPATCH</span>
                <span>&lt; 60 SECONDS</span>
              </div>
              <h3 className={`mt-2 text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Zero Cellular Latency
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Emergency beacon routes over 868MHz LoRa mesh hops, bypassing downed mobile cell towers to notify SAR coordinators instantly.
              </p>
            </div>

            <div
              className={`rounded-[var(--radius-xl)] border p-5 backdrop-blur-xl transition-all ${
                isDark ? "border-white/[0.06] bg-[#0c0d16]/60" : "border-slate-200 bg-white/70"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs text-emerald-400 font-semibold">
                <span>02 · BIOMETRIC TRIAGE</span>
                <span>FAIL-CLOSED AUDIT</span>
              </div>
              <h3 className={`mt-2 text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Pre-Arrival Vital Trends
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Flight medics receive preceding 6-hour SpO2 and cardiac trends so triage preparation begins before the aircraft touches down.
              </p>
            </div>

            <div
              className={`rounded-[var(--radius-xl)] border p-5 backdrop-blur-xl transition-all ${
                isDark ? "border-white/[0.06] bg-[#0c0d16]/60" : "border-slate-200 bg-white/70"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs text-amber-400 font-semibold">
                <span>03 · MULTI-CONSTELLATION GNSS</span>
                <span>2.5M RADIAL ACCURACY</span>
              </div>
              <h3 className={`mt-2 text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Granite Ravine Fix
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                NEO-6M satellite lock locks pin-point rescue coordinates even under heavy alpine tree cover and steep rock walls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   8.8. CINEMATIC 3D SAR HELICOPTER FLYBY ENGINE (MOVIE / GAME CUTSCENE)
   ========================================================================= */
function CinematicHelicopterFlybyOverlay({ onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext ? canvas.getContext("2d") : null;
    if (!ctx) {
      const fallbackTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1200);
      return () => clearTimeout(fallbackTimer);
    }

    let animId;
    let width = (canvas.width = window.innerWidth || 1200);
    let height = (canvas.height = window.innerHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth || 1200;
      height = canvas.height = window.innerHeight || 800;
    };
    window.addEventListener("resize", handleResize);

    const startTime = performance.now();
    const duration = 1350; // 1.35 seconds cinematic flight sequence

    const render = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, width, height);

      // Deep cinematic night atmosphere with dynamic searchlight haze
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.85
      );
      bgGrad.addColorStop(0, "rgba(2, 6, 23, 0.94)");
      bgGrad.addColorStop(0.65, "rgba(2, 4, 10, 0.97)");
      bgGrad.addColorStop(1, "rgba(1, 2, 5, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 3D Flight Trajectory Math (Movie / Game Engine Cutscene):
      // Swoops in dynamically from user's side (startX: 16% width, startY: 86% height),
      // banks smoothly toward center screen, then roars directly forward toward the camera!
      const startX = width * 0.16;
      const midX = width * 0.5;
      const curX = progress < 0.5 ? startX + (midX - startX) * (progress * 2) : midX;

      const startY = height * 0.86;
      const midY = height * 0.44;
      const curY =
        progress < 0.55
          ? startY - (startY - midY) * (progress / 0.55)
          : midY - (progress - 0.55) * 80;

      // 3D Perspective Scaling: accelerates into viewer's screen (0.4x -> 4.2x)
      const scale =
        progress < 0.65
          ? 0.42 + (progress / 0.65) * 0.78
          : 1.2 + Math.pow((progress - 0.65) / 0.35, 2.2) * 3.2;

      // 3D Banking Angles (Roll & Pitch)
      const rollAngle = progress < 0.5 ? -18 * (1 - progress / 0.5) : (progress - 0.5) * 8;

      // Draw Downwash Wind Shockwaves across the screen
      const downwashRings = 3;
      for (let i = 0; i < downwashRings; i++) {
        const ringProgress = (progress * 3.5 + i / downwashRings) % 1;
        const ringRadius = (50 + ringProgress * 320) * (scale * 0.7);
        const ringAlpha = (1 - ringProgress) * 0.25;
        ctx.beginPath();
        ctx.ellipse(curX, curY + 60 * scale, ringRadius, ringRadius * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
        ctx.lineWidth = 2 * (1 - ringProgress);
        ctx.stroke();
      }

      // Volumetric Dual Searchlight Beams (Cutting through snowy alpine mist)
      const beamAngle = Math.PI * 0.48 + Math.sin(progress * Math.PI * 2) * 0.08;
      const beamLength = 480 * scale;
      const beamSpread = 140 * scale;

      const drawSearchlight = (offsetX) => {
        const originX = curX + offsetX * scale;
        const originY = curY + 25 * scale;
        const targetX1 = originX + Math.cos(beamAngle) * beamLength - beamSpread * 0.5;
        const targetY1 = originY + Math.sin(beamAngle) * beamLength;
        const targetX2 = originX + Math.cos(beamAngle) * beamLength + beamSpread * 0.5;
        const targetY2 = originY + Math.sin(beamAngle) * beamLength;

        const beamGrad = ctx.createLinearGradient(originX, originY, originX, originY + beamLength);
        beamGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
        beamGrad.addColorStop(0.2, "rgba(224, 242, 254, 0.45)");
        beamGrad.addColorStop(0.65, "rgba(56, 189, 248, 0.15)");
        beamGrad.addColorStop(1, "rgba(2, 132, 199, 0)");

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(targetX1, targetY1);
        ctx.lineTo(targetX2, targetY2);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();
      };

      drawSearchlight(-35);
      drawSearchlight(35);

      // Save Context for 3D Aircraft Rendering
      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate((rollAngle * Math.PI) / 180);
      ctx.scale(scale, scale);

      // High-Speed Spinning Rotor Blade Disc (Blur effect at 2800 RPM)
      const rotorAngle = elapsed * 0.09;
      const rotorRadius = 155;

      // Aerodynamic Rotor Wash Disc Blur
      ctx.beginPath();
      ctx.ellipse(0, -32, rotorRadius, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(148, 163, 184, 0.2)";
      ctx.fill();
      ctx.strokeStyle = "rgba(203, 213, 225, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Individual Rotor Blades with Motion Blur
      for (let b = 0; b < 4; b++) {
        const bladeAng = rotorAngle + (b * Math.PI) / 2;
        const bx = Math.cos(bladeAng) * rotorRadius;
        const by = -32 + Math.sin(bladeAng) * 10;
        ctx.beginPath();
        ctx.moveTo(0, -32);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = "rgba(226, 232, 240, 0.6)";
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // High-vis safety orange blade tip markers
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#F97316";
        ctx.fill();
      }

      // Rotor Mast, Hub & Swashplate
      ctx.fillStyle = "#334155";
      ctx.fillRect(-5, -34, 10, 14);
      ctx.beginPath();
      ctx.arc(0, -32, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#475569";
      ctx.fill();

      // Tail Boom (Receding in 3D perspective)
      ctx.beginPath();
      ctx.moveTo(-16, -10);
      ctx.lineTo(-4, -65);
      ctx.lineTo(4, -65);
      ctx.lineTo(16, -10);
      ctx.closePath();
      ctx.fillStyle = "#0F172A";
      ctx.fill();
      ctx.strokeStyle = "#1E293B";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vertical Tail Fin & Spinning Tail Rotor
      ctx.fillStyle = "#EA580C"; // Rescue Orange vertical fin
      ctx.fillRect(-2, -75, 4, 18);
      ctx.beginPath();
      ctx.ellipse(6, -72, 18, 5, rotorAngle * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fuselage Body (Authentic Front Profile - Airbus H145 SAR spec)
      const fuseGrad = ctx.createLinearGradient(-60, 0, 60, 0);
      fuseGrad.addColorStop(0, "#0F172A");
      fuseGrad.addColorStop(0.3, "#1E293B");
      fuseGrad.addColorStop(0.5, "#334155");
      fuseGrad.addColorStop(0.7, "#1E293B");
      fuseGrad.addColorStop(1, "#0F172A");

      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.bezierCurveTo(48, -22, 64, -2, 62, 28);
      ctx.bezierCurveTo(60, 52, 34, 64, 0, 64);
      ctx.bezierCurveTo(-34, 64, -60, 52, -62, 28);
      ctx.bezierCurveTo(-64, -2, -48, -22, 0, -22);
      ctx.closePath();
      ctx.fillStyle = fuseGrad;
      ctx.fill();
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // High-Visibility Emergency SAR Tactical Markings (International Rescue Orange)
      ctx.beginPath();
      ctx.moveTo(-45, 36);
      ctx.lineTo(0, 58);
      ctx.lineTo(45, 36);
      ctx.lineTo(38, 28);
      ctx.lineTo(0, 48);
      ctx.lineTo(-38, 28);
      ctx.closePath();
      ctx.fillStyle = "#F97316";
      ctx.fill();

      // Cockpit Windshield (Tinted Glass Canopy with Pilot HUD Glow)
      const glassGrad = ctx.createLinearGradient(0, -15, 0, 22);
      glassGrad.addColorStop(0, "rgba(56, 189, 248, 0.65)");
      glassGrad.addColorStop(0.6, "rgba(14, 116, 144, 0.4)");
      glassGrad.addColorStop(1, "rgba(15, 23, 42, 0.85)");

      // Port (Left) Windshield Pane
      ctx.beginPath();
      ctx.moveTo(-3, -14);
      ctx.lineTo(-44, -2);
      ctx.lineTo(-40, 20);
      ctx.lineTo(-3, 16);
      ctx.closePath();
      ctx.fillStyle = glassGrad;
      ctx.fill();
      ctx.strokeStyle = "#0284C7";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Starboard (Right) Windshield Pane
      ctx.beginPath();
      ctx.moveTo(3, -14);
      ctx.lineTo(44, -2);
      ctx.lineTo(40, 20);
      ctx.lineTo(3, 16);
      ctx.closePath();
      ctx.fillStyle = glassGrad;
      ctx.fill();
      ctx.strokeStyle = "#0284C7";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pilot Cockpit Avionics Illumination (HUD green and cyber cyan)
      ctx.beginPath();
      ctx.arc(-22, 10, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 197, 94, 0.75)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(22, 10, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
      ctx.fill();

      // Chin-Mounted FLIR / Electro-Optical Search Turret
      ctx.beginPath();
      ctx.arc(0, 46, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#1E293B";
      ctx.fill();
      ctx.strokeStyle = "#64748B";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 46, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#0284C7";
      ctx.fill();

      // Heavy-Duty Tubular Landing Skids
      ctx.strokeStyle = "#94A3B8";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";

      // Left Skid
      ctx.beginPath();
      ctx.moveTo(-52, 74);
      ctx.lineTo(-24, 74);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-38, 48);
      ctx.lineTo(-38, 74);
      ctx.stroke();

      // Right Skid
      ctx.beginPath();
      ctx.moveTo(24, 74);
      ctx.lineTo(52, 74);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(38, 48);
      ctx.lineTo(38, 74);
      ctx.stroke();

      // Aviation Navigation Strobe Lights
      // Port Red Beacon
      ctx.beginPath();
      ctx.arc(-58, 26, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#EF4444";
      ctx.fill();

      // Starboard Green Beacon
      ctx.beginPath();
      ctx.arc(58, 26, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#22C55E";
      ctx.fill();

      // Anti-Collision Pulsing White Strobe
      if (Math.floor(elapsed / 180) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(0, -34, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      ctx.restore();

      // Flash/Bloom effect on apex transition
      if (progress > 0.82) {
        const flashAlpha = Math.min(1, (progress - 0.82) / 0.18);
        ctx.fillStyle = `rgba(0, 212, 255, ${flashAlpha * 0.45})`;
        ctx.fillRect(0, 0, width, height);
      }

      if (progress < 1) {
        animId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[150] pointer-events-none overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />

      {/* Cinematic SAR Dispatch Telemetry HUD Overlay */}
      <div className="absolute top-6 left-6 font-mono text-xs text-cyan-400 font-semibold tracking-wider flex items-center gap-2.5 bg-black/70 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span>SAR TACTICAL DISPATCH // VECTOR INBOUND 045°</span>
      </div>

      <div className="absolute bottom-8 font-mono text-xs text-slate-300 tracking-wider bg-black/80 px-5 py-2 rounded-full border border-slate-700/60 backdrop-blur-md">
        TRANSFERRING TO SECURE ACCOUNT REGISTRATION...
      </div>
    </div>
  );
}

/* =========================================================================
   9. MAIN LANDING COMPONENT (FULL-PAGE LIVING ATMOSPHERE & SEAMLESS 60FPS)
   ========================================================================= */
export default function Landing() {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [isHelicopterLaunching, setIsHelicopterLaunching] = useState(false);

  const handleStartTrial = (e) => {
    e?.preventDefault();
    if (isHelicopterLaunching) return;
    setIsHelicopterLaunching(true);
  };

  const handleHelicopterComplete = () => {
    navigate("/register");
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = [
        "overview",
        "problem-solution",
        "sensors",
        "mesh",
        "mission-video",
        "sar-extraction",
        "simulator",
        "privacy",
        "faq",
      ];
      const scrollPos = window.scrollY + 140;
      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 84;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const faqs = [
    {
      q: "Does TrailGuard require a monthly cellular subscription?",
      a: "No. TrailGuard operates over free-to-use LoRa radio (433/868/915 MHz) and satellite GNSS directly to basecamp hubs with zero recurring carrier fees.",
    },
    {
      q: "How does the on-device Edge Risk Engine eliminate false fall alarms?",
      a: "The firmware evaluates micro-freefall, impact shock (>3.0g), and repose posture, backed by a 30-second haptic cancel countdown to dismiss false trips.",
    },
    {
      q: "What happens if a hiker's companion phone battery dies?",
      a: "The wrist wearable is fully autonomous. It continues acquiring satellite coordinates, monitoring vitals, and broadcasting LoRa distress packets independently.",
    },
    {
      q: "What is TrailGuard's strict privacy invariant?",
      a: "Continuous telemetry remains strictly in an encrypted 7-day local buffer. Only an active, authenticated emergency transmits a 6-hour dossier to rescue teams.",
    },
    {
      q: "Can the basecamp dashboard function during internet blackouts?",
      a: "Yes. Built as an offline-first Progressive Web App (PWA), basecamp hubs cache maps and telemetry protocols locally to operate without connectivity.",
    },
  ];

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#070D1B] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Full-Page Living Atmosphere Canvas (Continuous Motion from Top to Bottom) */}
      <GlobalLivingAtmosphereCanvas isDark={isDark} />

      {/* Floating Navigation Bar */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto max-w-5xl rounded-full border px-5 py-2.5 backdrop-blur-2xl transition-all duration-300 ${
            isDark
              ? "border-white/[0.08] bg-[#0c0d12]/85 text-slate-200 shadow-xl"
              : "border-slate-200/80 bg-white/85 text-slate-800 shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                🛡
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight font-sans">
                  TRAIL<span className="text-cyan-500">GUARD</span>
                </span>
                <span className={`text-[8px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  SWAAS · Autonomous Safety
                </span>
              </div>
            </Link>

            <nav className={`hidden items-center gap-1 font-mono text-xs font-medium md:flex ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              {[
                { id: "#overview", label: "Overview", key: "overview" },
                { id: "#problem-solution", label: "Problem/Solution", key: "problem-solution" },
                { id: "#sensors", label: "Sensors", key: "sensors" },
                { id: "#mesh", label: "LoRa Mesh", key: "mesh" },
                { id: "#mission-video", label: "Recon", key: "mission-video" },
                { id: "#sar-extraction", label: "SAR Unit", key: "sar-extraction" },
                { id: "#simulator", label: "Simulator", key: "simulator" },
                { id: "#privacy", label: "Privacy", key: "privacy" },
              ].map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={(e) => smoothScrollTo(e, item.id)}
                    className={`rounded-full px-3 py-1 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-[#00D4FF]/15 text-[#00D4FF] font-semibold shadow-[0_0_12px_rgba(0,212,255,0.25)]"
                          : "bg-cyan-100 text-cyan-900 font-semibold"
                        : isDark
                        ? "hover:text-white hover:bg-white/5"
                        : "hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-medium transition cursor-pointer ${
                  isDark
                    ? "border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs"
                }`}
              >
                {isDark ? (
                  <>
                    <IoSunnyOutline className="h-3.5 w-3.5 text-amber-400" />
                    <span className="hidden sm:inline">LIGHT MODE</span>
                  </>
                ) : (
                  <>
                    <IoMoonOutline className="h-3.5 w-3.5 text-slate-700" />
                    <span className="hidden sm:inline">DARK MODE</span>
                  </>
                )}
              </button>

              <Link
                to="/login"
                className={`hidden rounded-full border px-3.5 py-1 font-mono text-xs font-medium transition sm:inline-block ${
                  isDark
                    ? "border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs"
                }`}
              >
                Operator Login
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 rounded-full bg-[#00D4FF] px-4 py-1.5 font-mono text-xs font-bold text-[#070D1B] shadow-sm transition hover:bg-[#38BDF8] active:scale-[0.98]"
              >
                <span>ACCESS WEB DASHBOARD</span>
                <IoArrowForwardOutline className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Seamless 60fps Video Flight Canvas & Enterprise Navy Theme */}
      <section
        id="overview"
        className="relative z-10 border-b px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 overflow-hidden min-h-[640px] flex items-center"
      >
        <SeamlessAlpineFlightCanvas isDark={isDark} />

        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {/* Enterprise Reliability Eyebrow */}
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono text-xs font-medium backdrop-blur-md ${
                  isDark
                    ? "border-[#00D4FF]/30 bg-[#00D4FF]/10 text-[#00D4FF]"
                    : "border-cyan-200 bg-white/80 text-cyan-800"
                }`}
              >
                <span className="flex h-2 w-2 rounded-full bg-[#00D4FF] animate-ping" />
                <span className="flex items-center gap-1.5">
                  <IoShieldCheckmarkOutline className="h-3.5 w-3.5 text-[#00D4FF]" />
                  <span>MISSION-CRITICAL WORKFORCE SAFETY · 99.999% LORA UPTIME</span>
                </span>
              </div>

              {/* Bold Headline Communicating Core Benefit */}
              <h1
                className={`mt-5 max-w-[660px] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-wrap-balance ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                Zero Lone-Worker Fatalities:{" "}
                <span className="bg-gradient-to-r from-[#00D4FF] via-[#38BDF8] to-[#2563EB] bg-clip-text text-transparent">
                  Off-Grid Telemetry and Fall Rescue for Wilderness Operations
                </span>
              </h1>

              {/* Supporting Subheading Clarifying What the Product Does */}
              <p className={`mt-4 max-w-[580px] text-base leading-relaxed sm:text-lg backdrop-blur-xs ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}>
                SWAAS equips field engineers, mining crews, and alpine operators with autonomous 
                wrist telemetry and 15 km LoRa mesh relays—triggering verified rescue dispatches in under 
                60 seconds without relying on cellular towers or cloud streaming.
              </p>

              {/* Single Primary Call-to-Action Button with Animated SAR Helicopter Launch */}
              <div className="mt-8 flex flex-col items-start gap-3.5">
                <button
                  type="button"
                  onClick={handleStartTrial}
                  className="group relative inline-flex items-center gap-3 rounded-xl bg-[#00D4FF] px-8 py-3.5 text-base font-bold text-[#070D1B] shadow-[0_0_30px_rgba(0,212,255,0.35)] transition-all duration-300 hover:bg-[#38BDF8] hover:shadow-[0_0_45px_rgba(0,212,255,0.5)] active:scale-[0.98] cursor-pointer"
                >
                  <span>Start Free Trial</span>
                  <IoArrowForwardOutline className="text-xl transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>

                {/* Risk Reversals & Enterprise Guarantees */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00D4FF]" />
                    14-day hardware pilot kit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00D4FF]" />
                    No credit card required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00D4FF]" />
                    ITAR & OSHA compliant
                  </span>
                </div>
              </div>

              {/* Floating Indicators */}
              <div className={`mt-10 grid grid-cols-2 gap-4 border-t pt-7 sm:grid-cols-4 font-mono ${
                isDark ? "border-white/10" : "border-slate-200/80"
              }`}>
                <div>
                  <div className="text-xl font-bold text-[#00D4FF]">15 km</div>
                  <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>LoRa Mesh</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-400">&lt; 3.0g</div>
                  <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Kinematic Threshold</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-400">100%</div>
                  <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Local Privacy</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-amber-400">Zero</div>
                  <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Cellular Dependent</div>
                </div>
              </div>
            </div>

            {/* 21st.dev Signature Border Beam HUD Card */}
            <div className="lg:col-span-5">
              <BorderBeamCard isDark={isDark}>
                <div className="flex items-center justify-between border-b pb-3 font-mono text-[10px] border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-semibold text-rose-400">REC [●] LIVE LiDAR SCAN</span>
                  </div>
                  <span className="text-slate-400 font-mono">60 FPS · 915MHz</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 font-medium">GPS LOCK // 12-SATELLITE FIX</div>
                    <div className="text-sm font-semibold tracking-tight text-white mt-0.5">
                      Mont Blanc Sector IV
                    </div>
                    <div className="font-mono text-xs text-slate-400">
                      45.8326° N · 6.8652° E
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400">ELEVATION</div>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      2,840m
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      Baro: 712 hPa
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border p-3 border-slate-800 bg-black/60">
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1.5">
                    <span className="text-slate-400 flex items-center gap-1">
                      <IoPulseOutline className="h-3 w-3 text-rose-500 animate-pulse" />
                      <span>Optical PPG Biosensor</span>
                    </span>
                    <span className="text-emerald-400 font-semibold">74 BPM · 99% SpO2</span>
                  </div>

                  <div className="relative h-10 w-full overflow-hidden">
                    <svg className="h-full w-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <path
                        d="M0,20 L30,20 L40,8 L50,32 L60,18 L70,20 L110,20 L120,5 L130,35 L140,15 L150,20 L200,20"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-grid-scan" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border px-3.5 py-2.5 font-mono text-xs border-slate-800 bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="text-slate-300">Basecamp HQ Link:</span>
                  </div>
                  <span className="text-cyan-300 font-semibold">11.4 km · -68 dBm</span>
                </div>
              </BorderBeamCard>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Ticker Strip */}
      <TelemetryMarqueeStrip isDark={isDark} />

      {/* SWAAS Problem vs Solution Section */}
      <SwaasProblemSolutionSection isDark={isDark} />

      {/* Interactive Bento Grid (Sensor Specifications) */}
      <section
        id="sensors"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-white/[0.06]" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-medium">
              <IoHardwareChipOutline className="h-4 w-4" />
              <span>Hardware Specification</span>
            </div>
            <h2 className={`mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Embedded Wearable Sensor & Edge Architecture
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Modular hardware architecture optimized for extreme battery life, military RF propagation, and zero-cloud dependence.
            </p>
          </div>

          <InteractiveBentoGrid isDark={isDark} />
        </div>
      </section>

      {/* Animated Beam Multi-Node Mesh Integration */}
      <section
        id="mesh"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-white/[0.06] bg-[#07080c]/60" : "border-slate-200/80 bg-slate-50/70"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <AnimatedBeamMeshDiagram isDark={isDark} />
        </div>
      </section>

      {/* Tactical Aerial Reconnaissance & Telemetry Video */}
      <section
        id="mission-video"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-white/[0.06]" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 font-medium">
              <IoVideocamOutline className="h-4 w-4" />
              <span>Tactical Aerial Reconnaissance</span>
            </div>
            <h2
              className={`mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Live Alpine Reconnaissance & Drone Relay
            </h2>
            <p
              className={`mt-2 text-sm leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Sub-second video stream with real-time canvas ambient halo refraction synchronized to the alpine terrain lighting.
            </p>
          </div>

          <div
            className={`relative mx-auto max-w-4xl p-3 sm:p-5 rounded-3xl border backdrop-blur-2xl transition-all duration-300 ${
              isDark
                ? "border-white/[0.08] bg-[#0c0d16]/75 shadow-[0_0_50px_rgba(6,182,212,0.12)]"
                : "border-slate-200 bg-white/80 shadow-xl"
            }`}
          >
            <VideoAmbient
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              poster={loginBg}
              blurAmount={65}
              intensity={0.8}
              autoPlay={false}
              muted={true}
              loop={true}
              className="rounded-2xl"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span>Sector IV Alpine Recon // Aerial 4K</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                Encrypted Live Mesh Feed // 433-915 MHz Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mountain SAR Airborne Rapid Response Section */}
      <SarAirborneExtractionSection isDark={isDark} />

      {/* Simulator Section with 360° Rotating Radar */}
      <section
        id="simulator"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-white/[0.06]" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-medium">
              <IoRadioOutline className="h-4 w-4" />
              <span>Interactive Incident Simulator</span>
            </div>
            <h2 className={`mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Autonomous Fall Detection & Dispatch
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Test the real-time kinematic fallback engine and 360° tactical LoRa radar terminal that triggers during alpine trauma.
            </p>
          </div>

          <div className="mt-8">
            <TacticalRadarTerminal isDark={isDark} />
          </div>
        </div>
      </section>

      {/* Privacy Architecture */}
      <section
        id="privacy"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-white/[0.06] bg-[#07080c]/60" : "border-slate-200/80 bg-slate-50/70"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-medium">
              <IoLockClosedOutline className="h-4 w-4" />
              <span>Defense-Grade Privacy</span>
            </div>
            <h2 className={`mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Zero Surveillance Architecture
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              TrailGuard is an emergency coordinator, never a corporate health tracker. Your biometric sovereignty is mathematically guaranteed.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                title: "Local-First 7-Day Encrypted Buffer",
                tag: "Invariant 01",
                desc: "All continuous PPG and motion data resides strictly inside on-device SQLite. Data auto-purges after 7 rolling days. Zero background cloud streaming.",
              },
              {
                title: "Emergency-Bounded 6-Hour Window",
                tag: "Invariant 02",
                desc: "Cloud telemetry sync is mechanically impossible unless an authorized emergency session is active. Replay is capped strictly to the incident plus preceding 6 hours.",
              },
              {
                title: "Fail-Closed Cryptographic Audit",
                tag: "Invariant 03",
                desc: "Every responder access to biometric records writes an immutable entry to AuditLog before reading. If audit write fails, system immediately aborts (HTTP 500).",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className={`rounded-2xl border p-5 backdrop-blur-md ${
                  isDark ? "border-white/[0.07] bg-[#0c0d14]/80" : "border-slate-200 bg-white shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400 font-medium">
                  <span>{pillar.tag}</span>
                  <IoLockClosedOutline className="h-3.5 w-3.5" />
                </div>
                <h3 className={`mt-3 text-sm font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {pillar.title}
                </h3>
                <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className={`relative z-10 border-b px-4 py-20 sm:px-6 sm:py-24 lg:px-8 transition-colors duration-500 ${
          isDark ? "border-white/[0.06]" : "border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 font-medium mb-1.5">
              <IoShieldCheckmarkOutline className="h-4 w-4" />
              <span>Field Operations FAQ</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Operational & Technical Clarifications
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all duration-200 ${
                    isDark ? "border-white/[0.07] bg-[#0c0d14]/80" : "border-slate-200 bg-white shadow-xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between p-4.5 text-left font-sans text-sm font-medium tracking-tight cursor-pointer"
                  >
                    <span className={isDark ? "text-slate-200" : "text-slate-900"}>{faq.q}</span>
                    <IoChevronDownOutline
                      className={`h-4 w-4 text-cyan-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className={`border-t px-4.5 pb-4.5 pt-2.5 text-xs leading-relaxed ${
                      isDark ? "border-slate-800/50 text-slate-400" : "border-slate-100 text-slate-600"
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

      {/* Footer */}
      <footer className={`relative z-10 px-4 py-10 sm:px-6 lg:px-8 border-t font-mono text-xs ${
        isDark ? "border-white/[0.06] bg-[#06070a] text-slate-500" : "border-slate-200 bg-slate-100 text-slate-600"
      }`}>
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-600 text-[10px] font-bold text-white">
              🛡
            </span>
            <span className="font-medium text-slate-400">
              TRAILGUARD / SWAAS · Autonomous Wilderness Safety
            </span>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <Link to="/dashboard" className="hover:text-cyan-400 transition">
              Dashboard
            </Link>
            <Link to="/login" className="hover:text-cyan-400 transition">
              Login
            </Link>
            <a href="#overview" className="hover:text-cyan-400 transition">
              Back to Top
            </a>
          </div>

          <div className="text-[10px] text-slate-500">
            ESP32-S3 · LoRa SX1278 · MAX30100 · MPU6050 · MIT Licensed
          </div>
        </div>
      </footer>

      {/* Cinematic 3D SAR Rescue Helicopter Flyby (Movie/Game Engine Flight Arc) */}
      {isHelicopterLaunching && (
        <CinematicHelicopterFlybyOverlay onComplete={handleHelicopterComplete} />
      )}
    </div>
  );
}
