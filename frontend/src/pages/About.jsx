import { useState } from "react";
import AppLayout from "../components/app/AppLayout";
import { useDevices } from "../context/DeviceContext";
import {
  ShieldCheck,
  Cpu,
  Smartphone,
  Radio,
  Activity,
  Compass,
  Thermometer,
  Lock,
  Layers,
  Zap,
  CheckCircle2,
  Heart,
  MapPin,
  LifeBuoy,
} from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "Mission & Purpose", icon: ShieldCheck },
  { id: "how-it-works", label: "How It Works", icon: Layers },
  { id: "hardware", label: "Wearable Hardware", icon: Cpu },
  { id: "privacy", label: "Privacy & Protection", icon: Lock },
];

import { maskDeviceId } from "../utils/masking";

export default function About() {
  const [activeTab, setActiveTab] = useState("overview");
  const { selectedDevice } = useDevices();

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-card)] p-6 shadow-sm sm:p-8">
          {/* Subtle atmospheric glow backdrop */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                SWAAS / TrailGuard Ecosystem
              </span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3 py-1 font-mono text-xs font-medium text-[var(--text-secondary)]">
                Smart Wearable Safety
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Off-Grid Ready
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Protection That Goes Where Cell Towers Can't
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                TrailGuard (SWAAS) is an autonomous safety companion designed for lone hikers,
                mountaineers, and outdoor enthusiasts. Combining real-time on-wrist biometrics,
                intelligent fall detection, and off-grid radio links, TrailGuard ensures you never
                explore alone.
              </p>
            </div>

            {/* TAB NAVIGATION */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border-default)] pt-4">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
                    activeTab === id
                      ? "border border-teal-500/30 bg-[#0E9C8C]/25 text-[#42E3D0] shadow-sm"
                      : "border border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "how-it-works" && <HowItWorksTab />}
        {activeTab === "hardware" && <HardwareTab selectedDevice={selectedDevice} />}
        {activeTab === "privacy" && <PrivacyTab />}
      </div>
    </AppLayout>
  );
}

/* =========================================================
 * 1. OVERVIEW TAB
 * ======================================================= */

function OverviewTab() {
  const pillars = [
    {
      icon: Radio,
      title: "Zero-Cellular Autonomy",
      description:
        "Standard smartwatches stop working when cell signal drops. TrailGuard features an integrated long-range radio (LoRa) capable of beaconing distress signals directly to basecamps and rangers up to 15 kilometers away.",
    },
    {
      icon: Activity,
      title: "Autonomous Fall Detection",
      description:
        "High-rate motion tracking analyzes sudden impact g-forces, body orientation, and post-fall stillness to distinguish real emergencies from dropped backpacks, minimizing false alarms.",
    },
    {
      icon: Heart,
      title: "Continuous Vitals Monitoring",
      description:
        "Tracks your heart rate and blood oxygen levels (SpO₂) in real time. If fatigue, hypoxia, or abnormal vitals are detected at altitude, the system issues early advisory alerts.",
    },
    {
      icon: LifeBuoy,
      title: "One-Touch Emergency SOS",
      description:
        "A dedicated physical SOS button triggers an immediate emergency packet broadcasting your exact satellite coordinates, elevation, and latest vital signs to emergency contacts.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pillars.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-card)] p-5 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-300/30 bg-teal-400/15 text-[#2DD4BF]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              {title}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
              {description}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK HIGHLIGHTS */}
      <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-card)] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          Built for Extreme Wilderness
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 text-center">
            <span className="font-mono text-2xl font-bold text-[#2DD4BF]">
              15 km
            </span>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Off-Grid Radio Range
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 text-center">
            <span className="font-mono text-2xl font-bold text-emerald-400">
              IP67
            </span>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Water & Dust Sealed
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 text-center">
            <span className="font-mono text-2xl font-bold text-amber-400">
              48 hrs
            </span>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Expedition Battery Life
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 text-center">
            <span className="font-mono text-2xl font-bold text-teal-400">
              ±2.5 m
            </span>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              GPS Position Accuracy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 * 2. HOW IT WORKS TAB
 * ======================================================= */

function HowItWorksTab() {
  const steps = [
    {
      step: "01",
      title: "On-Wrist Sensing",
      desc: "The ESP32-S3 wearable continuously samples pulse, blood oxygen, altitude, motion, and barometric pressure directly on your wrist.",
      icon: Cpu,
    },
    {
      step: "02",
      title: "Local Edge Processing",
      desc: "Data is analyzed directly on the companion device. If you're safe, telemetry stays strictly stored in your private local archive.",
      icon: Smartphone,
    },
    {
      step: "03",
      title: "Distress Detection",
      desc: "If a severe fall occurs or the SOS trigger is pushed, the device alerts you with a 30-second haptic countdown before calling for rescue.",
      icon: Zap,
    },
    {
      step: "04",
      title: "Rescue Coordination",
      desc: "Emergency responders receive your exact GPS coordinates, altitude profile, and recent vitals to dispatch immediate search and medical aid.",
      icon: MapPin,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ step, title, desc, icon: Icon }) => (
          <div
            key={step}
            className="flex flex-col justify-between rounded-[22px] border border-[var(--border-default)] bg-[var(--surface-card)] p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-[#2DD4BF]">
                  {step}
                </span>
                <Icon className="h-5 w-5 text-[var(--text-muted)]" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
 * 3. HARDWARE TAB
 * ======================================================= */

function HardwareTab({ selectedDevice }) {
  const sensors = [
    {
      name: "Pulse Oximeter",
      model: "MAX30100",
      role: "Measures blood pulse rate and oxygen saturation (SpO₂) via infrared photoplethysmography.",
      icon: Heart,
    },
    {
      name: "6-Axis Motion IMU",
      model: "MPU-6050",
      role: "Tracks tri-axial acceleration and gyroscopic rotation to identify abrupt falls, impacts, and body tilt.",
      icon: Zap,
    },
    {
      name: "Satellite GPS Receiver",
      model: "NEO-6M",
      role: "Acquires high-precision geodetic latitude, longitude, and elevation from global satellite constellations.",
      icon: Compass,
    },
    {
      name: "Barometric Weather Sensor",
      model: "BME280",
      role: "Monitors ambient temperature, relative humidity, and barometric air pressure for sudden mountain weather shifts.",
      icon: Thermometer,
    },
    {
      name: "Long-Range Radio Module",
      model: "LoRa SX1278",
      role: "Provides emergency transmission over long distances through dense forest and mountain valleys without cell signal.",
      icon: Radio,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* PAIRED DEVICE STATUS */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-[22px] border border-[var(--border-default)] bg-[var(--surface-card)] p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Paired Hardware
          </span>
          <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)]">
            {selectedDevice?.deviceName || selectedDevice?.name || "TrailGuard Wearable"}
          </h3>
          <p className="mt-0.5 font-mono text-xs text-[var(--text-secondary)]">
            ID: {selectedDevice ? maskDeviceId(selectedDevice.deviceId) : "Hardware Key Active"}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs font-medium text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Hardware Link Ready
        </span>
      </div>

      {/* SENSOR LIST */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sensors.map(({ name, model, role, icon: Icon }) => (
          <div
            key={name}
            className="flex flex-col gap-3 rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-card)] p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/30 bg-teal-400/15 text-[#2DD4BF]">
                <Icon className="h-4 w-4" />
              </div>
              <span className="rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2 py-0.5 font-mono text-xs text-[var(--text-secondary)]">
                {model}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                {name}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                {role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
 * 4. PRIVACY & PROTECTION TAB
 * ======================================================= */

function PrivacyTab() {
  const commitments = [
    {
      title: "Local-First Storage",
      desc: "Your continuous everyday health data (heart rate, step counts, routine coordinates) stays strictly stored on your phone. It is never automatically uploaded to any cloud server during normal safe conditions.",
    },
    {
      title: "Emergency-Only Cloud Sharing",
      desc: "Cloud transmission only activates when an SOS button is triggered or a verified fall countdown expires without cancellation. Cloud sharing is strictly bounded to the active emergency.",
    },
    {
      title: "Hardware Device Authentication",
      desc: "Every TrailGuard wearable contains a dedicated hardware digital key. Unauthorized devices cannot spoof your identity or inject counterfeit readings.",
    },
    {
      title: "Automated Data Expiration",
      desc: "Once an emergency incident is fully resolved, all transient real-time emergency records expire and are automatically purged, ensuring your location history is never retained indefinitely.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {commitments.map(({ title, desc }) => (
          <div
            key={title}
            className="flex flex-col gap-2 rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-card)] p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#2DD4BF]" />
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {title}
              </h3>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
