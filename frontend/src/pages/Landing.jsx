import { useState } from "react";
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
} from "react-icons/io5";

export default function Landing() {
  const { darkMode, toggleTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState(null);
  const [simState, setSimState] = useState("normal"); // normal | impact | sos

  const faqs = [
    {
      q: "Does TrailGuard require a monthly cellular subscription?",
      a: "No. TrailGuard operates over open-standard long-range LoRa radio (433/868/915 MHz ISM bands) and offline satellite GPS. It transmits directly to local basecamps and peer relays without recurring cellular carrier fees.",
    },
    {
      q: "How does the autonomous fall detection prevent false alarms?",
      a: "The on-device Edge Risk Engine continuously evaluates a 3-stage heuristic: free-fall acceleration (<0.5g), sudden impact spike (>3.0g), and subsequent stillness with post-impact tilt. If triggered, a 30-second haptic countdown allows the user to cancel before any SOS packet broadcasts.",
    },
    {
      q: "What happens if my smartphone battery dies while hiking?",
      a: "The ESP32-S3 wearable is a standalone safety node. Even if your paired phone is dead or lost, the wrist device continues monitoring vitals and automatically broadcasts emergency packets over LoRa radio when impact or SOS occurs.",
    },
    {
      q: "How is my personal medical data protected?",
      a: "TrailGuard follows a strict local-first privacy invariant. Normal everyday telemetry remains exclusively on your personal device in an encrypted 7-day rolling buffer. Only during an active, verified emergency is an encrypted 6-hour snapshot shared with authenticated rescue coordinators.",
    },
    {
      q: "Can I install TrailGuard as a standalone desktop or mobile app?",
      a: "Yes. TrailGuard is built as a Progressive Web App (PWA) with full offline caching. Simply tap 'Install App' in your browser address bar to install it directly onto your macOS, Windows, iOS, or Android home screen.",
    },
    {
      q: "What is the typical battery endurance in the backcountry?",
      a: "The wearable hardware delivers up to 48 hours of continuous operation on a single charge with smart FreeRTOS sensor throttling and low-power deep sleep during rest periods.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      {/* =====================================================================
          1. STICKY GLASS NAVBAR
          ===================================================================== */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-teal-300/30 bg-teal-400/15 text-lg shadow-sm tg-squircle-sm">
              🛡
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[var(--color-text)]">
                Trail<span className="text-[#2DD4BF]">Guard</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                SWAAS Safety Ecosystem
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-semibold text-[var(--color-text-secondary)] md:flex">
            <a href="#features" className="transition hover:text-[var(--color-text)]">
              Features
            </a>
            <a href="#hardware" className="transition hover:text-[var(--color-text)]">
              Hardware
            </a>
            <a href="#simulator" className="transition hover:text-[var(--color-text)]">
              Live Simulator
            </a>
            <a href="#privacy" className="transition hover:text-[var(--color-text)]">
              Privacy Pledge
            </a>
            <a href="#faq" className="transition hover:text-[var(--color-text)]">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)] tg-squircle-sm"
            >
              {darkMode ? <IoSunnyOutline className="h-4 w-4" /> : <IoMoonOutline className="h-4 w-4" />}
            </button>

            <Link
              to="/login"
              className="hidden rounded-[12px] border border-[var(--color-border)] px-3.5 py-2 text-xs font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)] sm:inline-block"
            >
              Sign In
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-[12px] bg-[var(--action-primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--action-primary-hover)]"
            >
              <span>Launch App</span>
              <IoArrowForwardOutline className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO SECTION
          ===================================================================== */}
      <section className="relative overflow-hidden px-4 pt-12 pb-20 sm:px-6 sm:pt-16 sm:pb-28 lg:px-8">
        {/* Ambient atmospheric gradients */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px] dark:bg-teal-500/15" />

        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Off-Grid LoRa & Satellite Telemetry · PWA Ready</span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Wilderness Safety That Works Where{" "}
            <span className="text-[#2DD4BF] bg-clip-text">Cell Towers Can't</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base lg:text-lg">
            TrailGuard (SWAAS) is an autonomous wearable safety platform engineered for lone hikers,
            geologists, and mountain rescue teams. Combining continuous on-wrist biometrics, autonomous fall impact
            recognition, and 15 km off-grid radio links with strict local-first privacy.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-[14px] bg-[var(--action-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[var(--action-primary-hover)] hover:shadow-teal-500/25 active:scale-[0.99]"
            >
              <span>Explore Live Dashboard</span>
              <IoArrowForwardOutline className="h-4 w-4" />
            </Link>

            <a
              href="#simulator"
              className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--color-text)] shadow-xs transition hover:bg-[var(--color-surface-alt)]"
            >
              Interactive Hardware Demo
            </a>
          </div>

          {/* Trust Metric Deck */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-8 sm:grid-cols-4">
            <div>
              <div className="font-mono text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">15 km</div>
              <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">Off-Grid LoRa Range</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-extrabold text-[#2DD4BF] sm:text-3xl">&lt;0.5s</div>
              <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">Impact Fall Trigger</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-extrabold text-emerald-500 sm:text-3xl">48 hrs</div>
              <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">Expedition Battery</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">100%</div>
              <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">Local-First Privacy</div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            HERO VISUAL: TACTICAL WEARABLE RADAR & TELEMETRY PREVIEW
            =================================================================== */}
        <div className="mx-auto mt-14 max-w-5xl">
          <div className="tg-card p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                  Wearable Node: ESP32-S3 (SX1278 Mesh)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]">
                <span>Satellite Fix: 8 Constellations</span>
                <span>·</span>
                <span className="text-emerald-500 font-semibold">Signal -84 dBm</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Telemetry Column 1 */}
              <div className="space-y-3">
                <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 tg-card-inner">
                  <div className="flex items-center justify-between">
                    <span className="tg-metric-label">Heart Rate (MAX30100)</span>
                    <IoPulseOutline className="text-red-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tabular-nums font-mono">74</span>
                    <span className="text-xs text-[var(--color-text-muted)]">BPM</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div className="h-full w-[65%] rounded-full bg-red-500" />
                  </div>
                </div>

                <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 tg-card-inner">
                  <div className="flex items-center justify-between">
                    <span className="tg-metric-label">Blood Oxygen (SpO₂)</span>
                    <IoShieldCheckmarkOutline className="text-teal-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tabular-nums font-mono">98%</span>
                    <span className="text-xs text-emerald-500 font-semibold">Optimal</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div className="h-full w-[98%] rounded-full bg-teal-400" />
                  </div>
                </div>
              </div>

              {/* Center Radar / Beacon Graphic */}
              <div className="flex flex-col items-center justify-center rounded-[16px] border border-[var(--color-border)] bg-slate-950 p-6 text-white tg-card-inner">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping" />
                  <div className="absolute inset-4 rounded-full border border-teal-500/30" />
                  <div className="absolute inset-8 rounded-full border border-dashed border-teal-500/40 animate-spin" style={{ animationDuration: "20s" }} />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 font-bold text-xl shadow-[0_0_20px_rgba(45,212,191,0.5)]">
                    📍
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="font-mono text-xs font-bold text-teal-400">20.2961° N, 85.8245° E</div>
                  <div className="text-[11px] text-slate-400">Elevation: 412m ASL · Active Waypoint</div>
                </div>
              </div>

              {/* Telemetry Column 2 */}
              <div className="space-y-3">
                <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 tg-card-inner">
                  <div className="flex items-center justify-between">
                    <span className="tg-metric-label">Motion IMU (MPU6050)</span>
                    <IoSpeedometerOutline className="text-amber-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tabular-nums font-mono">1.02g</span>
                    <span className="text-xs text-emerald-500 font-semibold">Stable Gait</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[var(--color-text-muted)] font-mono">
                    Tilt: 3.2° · Gyro: 0.1 rad/s
                  </div>
                </div>

                <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 tg-card-inner">
                  <div className="flex items-center justify-between">
                    <span className="tg-metric-label">Atmosphere (BME280)</span>
                    <IoThermometerOutline className="text-sky-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold font-mono">22.4°C</span>
                    <span className="text-xs text-[var(--color-text-muted)]">·</span>
                    <span className="text-2xl font-extrabold font-mono">1013 hPa</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[var(--color-text-muted)] font-mono">
                    Humidity: 54% · Fair Weather
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. PROBLEM VS. SOLUTION
          ===================================================================== */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF]">
              The Backcountry Paradox
            </h2>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Why Standard Smartwatches Fail Outside Cellular Cities
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Consumer smartwatches are tethered to 4G/5G towers. When a hiker takes a severe tumble in a mountain ravine,
              traditional smart devices disconnect. TrailGuard was engineered specifically for the zero-bar wilderness.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="tg-card p-6 border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                <IoAlertCircleOutline className="h-5 w-5" />
                <span>Standard Fitness Watch Failure Mode</span>
              </div>
              <ul className="mt-4 space-y-3 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Zero Connectivity:</strong> Shuts down emergency calling the second cell towers fade.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>False Alarm Dispatches:</strong> Dropping a backpack triggers panicked calls without haptic review.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Cloud Profiling:</strong> Uploads private biometric heart data continuously to corporate ad platforms.</span>
                </li>
              </ul>
            </div>

            <div className="tg-card p-6 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <IoCheckmarkCircleOutline className="h-5 w-5" />
                <span>The TrailGuard Autonomous Standard</span>
              </div>
              <ul className="mt-4 space-y-3 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>15 km LoRa Links:</strong> Emergency packets broadcast across mountain peaks to basecamps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>3-Stage Edge Verification:</strong> Combines free-fall, G-force impact, and body angle to eliminate false trips.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Fail-Closed Privacy:</strong> Health data stays strictly local; cloud sync is emergency-bounded.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. HARDWARE SENSOR BENTO GRID
          ===================================================================== */}
      <section id="hardware" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF]">
              Wearable Sensor Array
            </h2>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Precision Sensors Integrated on Wrist
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-[var(--color-text-secondary)] sm:text-sm">
              Custom FreeRTOS firmware running on the dual-core ESP32-S3 microcontroller.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-red-500/10 text-red-500 tg-squircle-sm">
                <IoPulseOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-[var(--color-text)]">MAX30100 Pulse Oximeter</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Dual-wavelength infrared and red photoplethysmography to detect acute hypoxia, altitude sickness, and erratic heart rates during steep ascents.
              </p>
              <div className="mt-4 font-mono text-[11px] text-[var(--color-text-muted)]">I2C Bus · 100 Hz Sampling</div>
            </div>

            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-amber-500/10 text-amber-500 tg-squircle-sm">
                <IoFlashOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-[var(--color-text)]">MPU-6050 6-Axis Motion IMU</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                3-axis gyroscope and 3-axis accelerometer running high-rate edge vector math to classify abrupt slips, falls, and unconscious postures.
              </p>
              <div className="mt-4 font-mono text-[11px] text-[var(--color-text-muted)]">±16g Range · Wake-on-Interrupt</div>
            </div>

            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-teal-500/10 text-teal-400 tg-squircle-sm">
                <IoRadioOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-[var(--color-text)]">LoRa SX1278 Transceiver</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Long-range chirp spread spectrum radio broadcasting encrypted SOS beacons over 15 kilometers without cellular or Wi-Fi towers.
              </p>
              <div className="mt-4 font-mono text-[11px] text-[var(--color-text-muted)]">433 MHz ISM · +20 dBm PA</div>
            </div>

            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-emerald-500/10 text-emerald-500 tg-squircle-sm">
                <IoCompassOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-[var(--color-text)]">NEO-6M Satellite GPS</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Acquires high-precision geodetic latitude, longitude, and elevation waypoints for accurate search-and-rescue team coordinates.
              </p>
              <div className="mt-4 font-mono text-[11px] text-[var(--color-text-muted)]">50-Channel Engine · ±2.5m Accuracy</div>
            </div>

            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-sky-500/10 text-sky-400 tg-squircle-sm">
                <IoThermometerOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-[var(--color-text)]">BME280 Atmospheric Sensor</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Barometric pressure and ambient temperature monitoring for rapid mountain weather shift alerts and altitude compensation.
              </p>
              <div className="mt-4 font-mono text-[11px] text-[var(--color-text-muted)]">300–1100 hPa · 0.18 Pa Resolution</div>
            </div>

            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-purple-500/10 text-purple-400 tg-squircle-sm">
                <IoHardwareChipOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-[var(--color-text)]">ESP32-S3 Core Processor</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Dual-core Xtensa LX7 running at 240 MHz with hardware cryptographic acceleration for Ed25519 digital signatures and BLE 5 Mesh.
              </p>
              <div className="mt-4 font-mono text-[11px] text-[var(--color-text-muted)]">512KB SRAM · Secure Boot & AES</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. INTERACTIVE LIVE SIMULATOR
          ===================================================================== */}
      <section id="simulator" className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF]">
              Test-Drive Incident Workflow
            </h2>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Interactive Emergency Trigger Simulator
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-[var(--color-text-secondary)] sm:text-sm">
              See how the hardware reacts during an emergency incident without needing a physical ESP32 attached.
            </p>
          </div>

          <div className="mt-10 tg-card p-6 shadow-xl sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[var(--color-border)] pb-6">
              <button
                type="button"
                onClick={() => setSimState("normal")}
                className={`rounded-[12px] px-4 py-2 text-xs font-bold transition ${
                  simState === "normal"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]"
                }`}
              >
                1. Normal Trail Hiking
              </button>
              <button
                type="button"
                onClick={() => setSimState("impact")}
                className={`rounded-[12px] px-4 py-2 text-xs font-bold transition ${
                  simState === "impact"
                    ? "bg-amber-500 text-white shadow-sm animate-pulse"
                    : "border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]"
                }`}
              >
                2. Fall Impact (4.8g Spike)
              </button>
              <button
                type="button"
                onClick={() => setSimState("sos")}
                className={`rounded-[12px] px-4 py-2 text-xs font-bold transition ${
                  simState === "sos"
                    ? "bg-red-600 text-white shadow-sm animate-bounce"
                    : "border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]"
                }`}
              >
                3. LoRa SOS Emergency Packet
              </button>
            </div>

            <div className="mt-6 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 tg-card-inner">
              {simState === "normal" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="mt-3 text-base font-bold text-[var(--color-text)]">Status: Operating Normally</h4>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Local SQLite buffer logging continuous 1-second cadence. Zero packets leaving the device.
                  </p>
                  <div className="mt-4 font-mono text-xs text-emerald-500">
                    Heart Rate: 72 bpm · IMU: 1.01g · LoRa: Standby · Satellite Fix: Optimal
                  </div>
                </div>
              )}

              {simState === "impact" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 text-2xl font-bold animate-pulse">
                    ⚠️
                  </div>
                  <h4 className="mt-3 text-base font-bold text-amber-500">Impact Detected: 4.8g G-Force</h4>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Wearable initiated a 30-second haptic wrist buzz. User can tap wrist to cancel if unhurt.
                  </p>
                  <div className="mt-4 inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 font-mono text-xs font-bold text-amber-500">
                    Haptic Countdown: 00:24 remaining before LoRa transmission
                  </div>
                </div>
              )}

              {simState === "sos" && (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-500 text-2xl font-bold">
                    🚨
                  </div>
                  <h4 className="mt-3 text-base font-bold text-red-500">CRITICAL SOS BROADCAST ACTIVE</h4>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    LoRa SX1278 transceiver is transmitting emergency coordinates to nearby rangers and Search & Rescue nodes.
                  </p>
                  <div className="mt-4 rounded-[12px] border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-400 text-left">
                    <div>PACKET_ID: 0xTG-EMERG-8921</div>
                    <div>COORDINATES: 20.29614 N, 85.82452 E (Elev: 412m)</div>
                    <div>VITALS: HR 148 bpm, SpO2 91% (Hypoxic Stress)</div>
                    <div>SIGNATURE: Ed25519 Validated Hardware Key</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. PRIVACY & INVARIANTS
          ===================================================================== */}
      <section id="privacy" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF]">
              Privacy By Architecture
            </h2>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Zero Continuous Cloud Health Lakes
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Unlike commercial fitness tech that monetizes your heartbeat and location trails, TrailGuard treats privacy as a safety-critical engineering invariant.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-teal-500/10 text-teal-400 tg-squircle-sm">
                <IoLockClosedOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold">Local-First Storage</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Your everyday heart rates, routes, and cadence stay encrypted on your companion phone in an on-device 7-day rolling buffer.
              </p>
            </div>

            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-emerald-500/10 text-emerald-500 tg-squircle-sm">
                <IoShieldCheckmarkOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold">Emergency-Bounded Sync</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Telemetry leaves your personal device and enters the cloud only during an authorized emergency session, bounded to at most the preceding 6 hours.
              </p>
            </div>

            <div className="tg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-sky-500/10 text-sky-400 tg-squircle-sm">
                <IoHardwareChipOutline className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold">Ed25519 Cryptographic Keys</h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Every hardware node possesses pre-provisioned asymmetric keypairs. Rogue nodes or spoofed coordinates are rejected fail-closed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. FAQ ACCORDION
          ===================================================================== */}
      <section id="faq" className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF]">
              Questions & Answers
            </h2>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] transition tg-card-inner"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-bold text-[var(--color-text)] transition hover:text-[#2DD4BF]"
                  >
                    <span>{faq.q}</span>
                    <IoChevronDownOutline
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#2DD4BF]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[var(--color-border)] p-4 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
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
          8. CONVERSION FOOTER CTA
          ===================================================================== */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-14">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            Explore the Backcountry with Absolute Confidence
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-xs text-[var(--color-text-secondary)] sm:text-sm">
            Launch the live rescue web dashboard, connect your wearable node, and stay protected off-grid.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-[14px] bg-[var(--action-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--action-primary-hover)]"
            >
              <span>Launch Live Dashboard</span>
              <IoArrowForwardOutline className="h-4 w-4" />
            </Link>

            <Link
              to="/register"
              className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--color-text)] shadow-xs transition hover:bg-[var(--color-surface-alt)]"
            >
              Create Free Account
            </Link>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 text-xs text-[var(--color-text-muted)] sm:flex-row">
            <div>© {new Date().getFullYear()} TrailGuard (SWAAS). Autonomous Smart Wearable Ecosystem.</div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-[var(--color-text)]">
                About Architecture
              </Link>
              <Link to="/login" className="hover:text-[var(--color-text)]">
                Operator Login
              </Link>
              <a href="#privacy" className="hover:text-[var(--color-text)]">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
