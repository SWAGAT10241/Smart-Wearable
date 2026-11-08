import { useState, useEffect } from "react";
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
  IoLayersOutline,
} from "react-icons/io5";

export default function Landing() {
  const { darkMode = true, toggleTheme = () => {} } = useTheme() || {};
  const [activeFaq, setActiveFaq] = useState(null);
  const [simMode, setSimMode] = useState("normal"); // normal | impact | sos
  const [simTimer, setSimTimer] = useState(30);

  // Simulator countdown timer
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
      q: "How does on-device Edge Risk Engine eliminate false fall alarms?",
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
    <div className="min-h-screen bg-[#0A0F17] text-[#E2E8F0] selection:bg-[#0284C7] selection:text-white">
      {/* =====================================================================
          1. STRUCTURED EXECUTIVE TOPBAR
          ===================================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#1E293B] bg-[#0A0F17]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#0284C7] text-lg font-bold text-white shadow-xs">
              🛡
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                TRAIL<span className="text-[#38BDF8]">GUARD</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#94A3B8]">
                SWAAS // AUTONOMOUS SAFETY ECOSYSTEM
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-mono uppercase tracking-wider text-[#94A3B8] md:flex">
            <a href="#overview" className="transition hover:text-white">
              01. OVERVIEW
            </a>
            <a href="#hardware" className="transition hover:text-white">
              02. SENSOR SPECS
            </a>
            <a href="#simulator" className="transition hover:text-white">
              03. SIMULATOR
            </a>
            <a href="#privacy" className="transition hover:text-white">
              04. PRIVACY
            </a>
            <a href="#faq" className="transition hover:text-white">
              05. FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#1E293B] bg-[#111827] text-[#94A3B8] transition hover:bg-[#1E293B] hover:text-white"
            >
              {darkMode ? <IoSunnyOutline className="h-4 w-4" /> : <IoMoonOutline className="h-4 w-4" />}
            </button>

            <Link
              to="/login"
              className="hidden rounded-[8px] border border-[#1E293B] bg-[#111827] px-4 py-2 font-mono text-xs font-semibold text-[#CBD5E1] transition hover:bg-[#1E293B] hover:text-white sm:inline-block"
            >
              OPERATOR LOGIN
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-[8px] bg-[#0284C7] px-4 py-2 font-mono text-xs font-bold text-white transition hover:bg-[#0369A1] active:scale-[0.98]"
            >
              <span>LAUNCH DASHBOARD</span>
              <IoArrowForwardOutline className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO SECTION — CLEAN EXECUTIVE COMMAND ARCHITECTURE
          ===================================================================== */}
      <section id="overview" className="border-b border-[#1E293B] px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header Metadata Pill */}
          <div className="flex items-center gap-2 font-mono text-xs text-[#0284C7]">
            <span className="flex h-2 w-2 rounded-full bg-[#10B981]" />
            <span className="font-bold tracking-wider uppercase text-[#38BDF8]">
              OFF-GRID LORA TELEMETRY // MULTI-SATELLITE GPS // LOCAL-FIRST ARCHITECTURE
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-sans uppercase max-w-4xl leading-tight">
            Off-Grid Telemetry and Fall Rescue for Wilderness Operations
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#94A3B8] sm:text-base lg:text-lg font-sans">
            TrailGuard (SWAAS) is an autonomous safety platform designed for lone workers, geologists, and search-and-rescue teams.
            Combining continuous on-wrist biometrics, 3-stage kinematic fall impact detection, and 15 km LoRa mesh radio links with strict local-first privacy.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5 font-mono text-xs">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-[8px] bg-[#0284C7] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0369A1]"
            >
              <span>ACCESS WEB DASHBOARD</span>
              <IoArrowForwardOutline className="h-4 w-4" />
            </Link>

            <a
              href="#simulator"
              className="rounded-[8px] border border-[#1E293B] bg-[#111827] px-6 py-3.5 text-sm font-semibold text-[#CBD5E1] transition hover:bg-[#1E293B] hover:text-white"
            >
              TEST EMERGENCY SIMULATOR
            </a>
          </div>

          {/* Key Engineering Specifications Bar */}
          <div className="mt-14 grid grid-cols-2 gap-px border border-[#1E293B] bg-[#1E293B] sm:grid-cols-4 font-mono">
            <div className="bg-[#0D1422] p-5">
              <div className="text-2xl font-bold text-[#38BDF8] sm:text-3xl">15.0 KM</div>
              <div className="mt-1 text-xs text-[#64748B]">LORA SX1278 RF RANGE</div>
            </div>
            <div className="bg-[#0D1422] p-5">
              <div className="text-2xl font-bold text-[#F59E0B] sm:text-3xl">&lt;0.5 SEC</div>
              <div className="mt-1 text-xs text-[#64748B]">IMPACT KINEMATICS RESPONSE</div>
            </div>
            <div className="bg-[#0D1422] p-5">
              <div className="text-2xl font-bold text-[#10B981] sm:text-3xl">48 HOURS</div>
              <div className="mt-1 text-xs text-[#64748B]">EXPEDITION FIELD BATTERY</div>
            </div>
            <div className="bg-[#0D1422] p-5">
              <div className="text-2xl font-bold text-[#A855F7] sm:text-3xl">FAIL-CLOSED</div>
              <div className="mt-1 text-xs text-[#64748B]">ED25519 CRYPTO SECURITY</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. HARDWARE INSTRUMENT CONSOLE PREVIEW (SOLID RGB)
          ===================================================================== */}
      <section className="border-b border-[#1E293B] bg-[#0D1422] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[16px] border border-[#1E293B] bg-[#111827] p-6 shadow-sm">
            {/* Header Status Deck */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                <span className="font-bold text-white uppercase tracking-wider">
                  NODE 01: ESP32-S3 // HARDWARE INSTRUMENT PREVIEW
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <span>SATELLITE FIX: 12 CONSTELLATIONS</span>
                <span>·</span>
                <span className="text-[#38BDF8] font-bold">RF: 433.92 MHZ</span>
              </div>
            </div>

            {/* 3 Solid Metric Blocks */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 font-mono">
              {/* Card 1: Vitals */}
              <div className="rounded-[12px] border border-[#1E293B] bg-[#0A0F17] p-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="font-semibold uppercase">CARDIAC TELEMETRY</span>
                  <span className="text-[#EF4444] font-bold flex items-center gap-1">
                    <IoPulseOutline />
                    ACTIVE
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">74</span>
                  <span className="text-xs text-[#64748B]">BPM</span>
                  <span className="ml-auto text-xs text-[#38BDF8] font-bold">SpO₂: 98%</span>
                </div>
                <div className="mt-3 text-[11px] text-[#64748B]">
                  SENSOR: MAX30100 OPTICAL PPG // NORMAL SINUS
                </div>
              </div>

              {/* Card 2: Coordinates */}
              <div className="rounded-[12px] border border-[#1E293B] bg-[#0A0F17] p-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="font-semibold uppercase">GEODETIC POSITION</span>
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <IoCompassOutline />
                    LOCKED
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-lg font-bold text-[#38BDF8]">20.2961° N, 85.8245° E</div>
                  <div className="text-xs text-[#64748B] mt-0.5">ELEVATION: 412M ASL · ACCURACY: ±2.5M</div>
                </div>
                <div className="mt-3 text-[11px] text-[#64748B]">
                  RECEIVER: NEO-6M // WGS-84 DATUM
                </div>
              </div>

              {/* Card 3: Motion IMU */}
              <div className="rounded-[12px] border border-[#1E293B] bg-[#0A0F17] p-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="font-semibold uppercase">6-AXIS KINEMATICS</span>
                  <span className="text-[#F59E0B] font-bold flex items-center gap-1">
                    <IoSpeedometerOutline />
                    STABLE
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">1.02</span>
                  <span className="text-xs text-[#64748B]">G-FORCE</span>
                  <span className="ml-auto text-xs text-[#10B981] font-bold">TILT: 3.2°</span>
                </div>
                <div className="mt-3 text-[11px] text-[#64748B]">
                  IMU: MPU-6050 // VECTORS WITHIN THRESHOLD
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. SENSOR ARRAY HARDWARE BENTO (SOLID RGB)
          ===================================================================== */}
      <section id="hardware" className="border-b border-[#1E293B] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="font-mono text-xs font-bold text-[#0284C7] uppercase tracking-wider">
            02 // SENSOR SPECIFICATIONS
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl font-sans uppercase">
            Aviation-Grade Sensor Architecture
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[#94A3B8]">
            Six dedicated hardware subsystems integrated directly onto the wrist unit and running deterministic real-time tasks.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Sensor 1 */}
            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6 hover:bg-[#151E30] hover:border-[#0284C7] transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#EF4444]/15 text-[#EF4444] text-lg">
                <IoPulseOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                MAX30100 Pulse Oximeter
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                Dual-wavelength infrared and red photoplethysmography to detect acute hypoxia, altitude sickness, and heart rate irregularities during steep mountain climbs.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E293B] font-mono text-[11px] text-[#38BDF8]">
                I2C BUS · 100 HZ SAMPLING · 16-BIT ADC
              </div>
            </div>

            {/* Sensor 2 */}
            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6 hover:bg-[#151E30] hover:border-[#F59E0B] transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#F59E0B]/15 text-[#F59E0B] text-lg">
                <IoSpeedometerOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                MPU-6050 6-Axis Motion IMU
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                3-axis accelerometer and gyroscope tracking orientation quaternions and G-force spikes. Classifies free-fall, impact shock, and post-fall stillness.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E293B] font-mono text-[11px] text-[#F59E0B]">
                RANGE: ±16G · WAKE-ON-MOTION · VECTOR MATH
              </div>
            </div>

            {/* Sensor 3 */}
            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6 hover:bg-[#151E30] hover:border-[#38BDF8] transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#0284C7]/15 text-[#38BDF8] text-lg">
                <IoRadioOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                LoRa SX1278 Transceiver
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                Long-range chirp spread spectrum RF module broadcasting distress signals across mountain ranges up to 15 kilometers without cellular or satellite subscription fees.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E293B] font-mono text-[11px] text-[#38BDF8]">
                433 MHZ ISM · +20 DBM PA · 15 KM RADIUS
              </div>
            </div>

            {/* Sensor 4 */}
            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6 hover:bg-[#151E30] hover:border-[#10B981] transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#10B981]/15 text-[#10B981] text-lg">
                <IoCompassOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                NEO-6M Satellite GPS
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                Acquires precision geodetic coordinates from GPS and GLONASS constellations. Embeds latitude, longitude, and altitude profile directly into every emergency packet.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E293B] font-mono text-[11px] text-[#10B981]">
                50 CHANNELS · -161 DBM · ACCURACY ±2.5M
              </div>
            </div>

            {/* Sensor 5 */}
            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6 hover:bg-[#151E30] hover:border-[#38BDF8] transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#0284C7]/15 text-[#38BDF8] text-lg">
                <IoThermometerOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                BME280 Atmospheric Sensor
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                Monitors barometric air pressure and temperature shifts. Predicts sudden alpine weather shifts and validates GPS barometric altitude calculations.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E293B] font-mono text-[11px] text-[#38BDF8]">
                300–1100 HPA · 0.18 PA RESOLUTION
              </div>
            </div>

            {/* Sensor 6 */}
            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6 hover:bg-[#151E30] hover:border-[#A855F7] transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#A855F7]/15 text-[#A855F7] text-lg">
                <IoHardwareChipOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                ESP32-S3 Dual-Core SOC
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                240 MHz Xtensa dual-core processor with vector extensions. Executes the on-device Edge Risk Engine and signs packets using hardware Ed25519 cryptography.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E293B] font-mono text-[11px] text-[#A855F7]">
                240 MHZ · ED25519 ASYMMETRIC · FREERTOS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. EMERGENCY SIMULATOR (SOLID RGB)
          ===================================================================== */}
      <section id="simulator" className="border-b border-[#1E293B] bg-[#0D1422] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="font-mono text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              03 // INCIDENT WORKFLOW
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl font-sans uppercase">
              Interactive Emergency Trigger Simulator
            </h2>
            <p className="mt-3 text-sm text-[#94A3B8]">
              Test how the hardware transitions from normal standby to fall detection and automated LoRa dispatch.
            </p>
          </div>

          <div className="mt-10 rounded-[16px] border border-[#1E293B] bg-[#111827] p-6 sm:p-8">
            {/* Mode Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#1E293B] pb-6 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSimMode("normal")}
                className={`rounded-[8px] px-4 py-2.5 font-bold transition ${
                  simMode === "normal"
                    ? "bg-[#0284C7] text-white"
                    : "border border-[#1E293B] bg-[#0A0F17] text-[#94A3B8] hover:text-white"
                }`}
              >
                1. NORMAL TRAIL MONITORING
              </button>
              <button
                type="button"
                onClick={() => setSimMode("impact")}
                className={`rounded-[8px] px-4 py-2.5 font-bold transition ${
                  simMode === "impact"
                    ? "bg-[#F59E0B] text-[#0A0F17]"
                    : "border border-[#1E293B] bg-[#0A0F17] text-[#94A3B8] hover:text-white"
                }`}
              >
                2. FALL IMPACT SPIKE (4.82G)
              </button>
              <button
                type="button"
                onClick={() => setSimMode("sos")}
                className={`rounded-[8px] px-4 py-2.5 font-bold transition ${
                  simMode === "sos"
                    ? "bg-[#EF4444] text-white"
                    : "border border-[#1E293B] bg-[#0A0F17] text-[#94A3B8] hover:text-white"
                }`}
              >
                3. LORA EMERGENCY BURST
              </button>
            </div>

            {/* Simulator Output State */}
            <div className="mt-6 rounded-[12px] border border-[#1E293B] bg-[#0A0F17] p-6 font-mono">
              {simMode === "normal" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981] text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="mt-4 text-base font-bold text-white">SYSTEM STATE: NOMINAL</h4>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Local SQLite buffer logging continuous 1-second cadence. Zero packets leaving device.
                  </p>
                  <div className="mt-4 inline-block rounded-[6px] border border-[#1E293B] bg-[#111827] px-4 py-1 text-xs text-[#38BDF8]">
                    HR: 74 BPM · IMU: 1.01G · LORA: STANDBY · SATELLITE: OPTIMAL
                  </div>
                </div>
              )}

              {simMode === "impact" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-2xl font-bold">
                    ⚠️
                  </div>
                  <h4 className="mt-4 text-base font-bold text-[#F59E0B]">CRITICAL FALL IMPACT DETECTED (4.82G)</h4>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Wearable initiated a 30-second haptic countdown. Hiker can tap to cancel if unhurt.
                  </p>
                  <div className="mt-4 inline-block rounded-[6px] bg-[#F59E0B]/15 px-5 py-2 text-xs font-bold text-[#F59E0B]">
                    HAPTIC COUNTDOWN: 00:{simTimer < 10 ? `0${simTimer}` : simTimer} REMAINING
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setSimMode("normal")}
                      className="rounded-[8px] bg-[#F59E0B] px-5 py-2 text-xs font-bold text-[#0A0F17] hover:bg-[#D97706]"
                    >
                      I AM UNHURT (CANCEL ALARM)
                    </button>
                  </div>
                </div>
              )}

              {simMode === "sos" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EF4444]/20 text-[#EF4444] text-2xl font-bold">
                    🚨
                  </div>
                  <h4 className="mt-4 text-base font-bold text-[#EF4444]">LORA EMERGENCY BURST BROADCASTING</h4>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Long-range RF beacon dispatched to Search and Rescue basecamps with validated Ed25519 signature.
                  </p>
                  <div className="mt-4 rounded-[8px] border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-left text-xs text-[#FCA5A5] space-y-1">
                    <div>PACKET_ID: 0xTG-EMERG-8921 // CHECKSUM: 0xE42A</div>
                    <div>COORDINATES: 20.29614° N, 85.82452° E (ELEV: +412M)</div>
                    <div>VITALS: HR 148 BPM // SPO2 91% (ACUTE HYPOXIA)</div>
                    <div>SIGNATURE: ED25519 HARDWARE KEY AUTHENTICATED</div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setSimMode("normal")}
                      className="rounded-[8px] border border-[#1E293B] bg-[#111827] px-4 py-2 text-xs font-bold text-[#CBD5E1] hover:text-white"
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
          6. PRIVACY INVARIANTS (SOLID RGB)
          ===================================================================== */}
      <section id="privacy" className="border-b border-[#1E293B] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="font-mono text-xs font-bold text-[#10B981] uppercase tracking-wider">
            04 // ZERO-TOLERANCE SECURITY
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl font-sans uppercase">
            Privacy By Architecture
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[#94A3B8]">
            Unlike consumer smart bands that harvest biometric data into cloud lakes, TrailGuard treats privacy as a safety-critical engineering invariant.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#0284C7]/15 text-[#38BDF8] text-lg">
                <IoLockClosedOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                Invariant 1: Local-First Storage
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                Continuous heart rate and location samples remain exclusively on your companion device in an encrypted 7-day rolling SQLite buffer. Never continuously uploaded to any cloud server.
              </p>
            </div>

            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#10B981]/15 text-[#10B981] text-lg">
                <IoShieldCheckmarkOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                Invariant 2: Emergency-Bounded Sharing
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                Telemetry leaves your personal device and enters the cloud backend strictly during an active authorized emergency session, bounded to at most the preceding 6 hours.
              </p>
            </div>

            <div className="rounded-[12px] border border-[#1E293B] bg-[#111827] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#A855F7]/15 text-[#A855F7] text-lg">
                <IoHardwareChipOutline />
              </div>
              <h3 className="mt-4 text-base font-bold text-white uppercase font-sans">
                Invariant 4: Ed25519 Signatures
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                Hardware nodes authenticate every packet using asymmetric Ed25519 digital signatures. Nonce replay tracking and fail-closed audit logs prevent counterfeit sensor feeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. FAQ ACCORDION (SOLID RGB)
          ===================================================================== */}
      <section id="faq" className="border-b border-[#1E293B] bg-[#0D1422] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="font-mono text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              05 // FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl font-sans uppercase">
              Technical Documentation & FAQs
            </h2>
          </div>

          <div className="mt-12 space-y-3 font-sans">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-[10px] border border-[#1E293B] bg-[#111827] transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-bold text-white transition hover:text-[#38BDF8]"
                  >
                    <span>{faq.q}</span>
                    <IoChevronDownOutline
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 text-[#38BDF8] ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#1E293B] p-5 text-xs leading-relaxed text-[#94A3B8] sm:text-sm">
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
          8. EXECUTIVE FOOTER
          ===================================================================== */}
      <footer className="bg-[#0A0F17] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 border-b border-[#1E293B] pb-12 sm:flex-row">
            <div>
              <h3 className="text-2xl font-bold text-white font-sans uppercase">
                Ready to Deploy Wilderness Safety?
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Access the rescue dashboard or register a new wearable node.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-[8px] bg-[#0284C7] px-6 py-3 font-mono text-xs font-bold text-white hover:bg-[#0369A1]"
              >
                LAUNCH MISSION
              </Link>
              <Link
                to="/register"
                className="rounded-[8px] border border-[#1E293B] bg-[#111827] px-6 py-3 font-mono text-xs font-semibold text-[#CBD5E1] hover:text-white"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 font-mono text-xs text-[#64748B] sm:flex-row">
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
