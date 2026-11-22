import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineExclamationTriangle,
  HiOutlineCpuChip,
  HiOutlineSignal,
  HiOutlineBolt,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { IoBatteryFullOutline, IoBatteryChargingOutline } from "react-icons/io5";

import { useDevices } from "../context/DeviceContext";
import { useLiveData } from "../context/LiveDataContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import useUpdatedTime from "../hooks/useUpdatedTime";
import loginBackground from "../assets/images/login-background.webp";
import { maskDeviceId } from "../utils/masking";
import SearchModal from "./common/SearchModal";

const PRIMARY_NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2, hasAlertBadge: true },
  { to: "/history", label: "History", icon: HiOutlineClock, hasAlertBadge: false },
  { to: "/settings", label: "Settings", icon: HiOutlineCog6Tooth, hasAlertBadge: false },
];

export default function Sidebar() {
  const { selectedDevice } = useDevices();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Collapsible mini-rail state with local preference persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("trailguard_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("trailguard_sidebar_collapsed", String(next));
      } catch {
        // Safe storage fallback
      }
      return next;
    });
  }, []);

  // Keyboard shortcut: Press "[" to toggle sidebar collapse, and "⌘K" / "Ctrl+K" for Incident Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || document.activeElement?.isContentEditable) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "[" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapse]);

  // Safe Context Access (Zero throw when rendered in test environments without all providers)
  let auth = {};
  try {
    auth = useAuth() || {};
  } catch {
    auth = {};
  }
  const user = auth.user;
  const logout = auth.logout || (() => {});

  let themeState = { isDark: true, toggleTheme: () => {} };
  try {
    const t = useTheme();
    if (t) themeState = t;
  } catch {
    themeState = { isDark: true, toggleTheme: () => {} };
  }
  const { isDark, toggleTheme } = themeState;

  let liveData = {};
  try {
    liveData = useLiveData() || {};
  } catch {
    liveData = {};
  }
  const connected = !!liveData.connected;
  const bleConnected = !!liveData.bleConnected;
  const activeFall = liveData.activeFall;
  const deviceStatus = liveData.deviceStatus;
  const vitals = liveData.vitals;

  // Extract battery & charging status
  const batteryPercent =
    deviceStatus?.batteryPercent ?? vitals?.batteryPercent ?? null;
  const isCharging = deviceStatus?.charging ?? vitals?.charging ?? false;

  const deviceName =
    selectedDevice?.deviceName || selectedDevice?.name || "TrailGuard Wearable";
  const activeLastSeen = liveData?.lastSeen || selectedDevice?.lastSeen;
  const lastSeenText = useUpdatedTime(activeLastSeen);

  // Derive user initials & role
  const userName = user?.name || user?.fullName || user?.username || "Operator";
  const userInitials = userName
    .split(/[\s_]+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const userRole = (user?.role || "Responder").toUpperCase();

  return (
    <aside
      role="navigation"
      aria-label="Main Navigation"
      className={`sticky top-0 h-screen shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-r border-white/[0.08] bg-gradient-to-b from-[var(--brand-navy-deep)] via-[var(--brand-navy)] to-[var(--brand-navy-deep)] shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-30 hidden lg:flex lg:flex-col ${
        isCollapsed ? "w-[72px]" : "w-[276px]"
      }`}
    >
      {/* ATMOSPHERIC BACKGROUND WITH AUTHENTIC MOUNTAIN SILHOUETTE (Optimized 35KB WebP) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-navy-deep)]/95 via-[var(--brand-navy)]/90 to-[var(--brand-navy-deep)]/95" />

      {/* TACTICAL RADIAL GLOW AT TOP (Bound to --brand-teal-glow) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--brand-teal-glow),transparent)]" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-cover bg-bottom opacity-75 transition-opacity"
        style={{ backgroundImage: `url(${loginBackground})` }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]"
        style={{
          background:
            "linear-gradient(to bottom, var(--brand-navy-deep) 0%, rgba(6,27,45,.97) 20%, rgba(6,27,45,.88) 45%, rgba(6,27,45,.62) 72%, rgba(6,27,45,.85) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[var(--brand-navy-deep)]/10" />

      {/* CONTENT (Compact Proportional Padding with Non-Clipping Scroll) */}
      <div className="relative z-10 flex h-full flex-col p-3.5 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* =========================================================
            HEADER: VECTOR ALPINE CREST LOGO + MINI-RAIL TOGGLE
            ======================================================= */}
        <div className="mb-4 flex items-center justify-between gap-1.5 px-1 pt-1">
          <Link
            to="/"
            title="TrailGuard Mission Command"
            className="flex items-center gap-2.5 group overflow-hidden"
          >
            {/* Precision Geometric Alpine Shield Crest (Replacing raw OS emoji) */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-teal-400/40 bg-teal-500/15 text-[var(--brand-teal)] shadow-[0_0_15px_rgba(45,212,191,0.25)] ring-1 ring-teal-400/20 transition-all group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(45,212,191,0.45)]">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                <path d="M8 14.5l4-5.5 4 5.5" />
                <path d="M12 9v6" />
              </svg>
            </span>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-bold tracking-tight text-white font-sans leading-tight drop-shadow-sm">
                  Trail<span className="text-[var(--brand-teal)] drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">Guard</span>
                </span>
                <span className="text-[9px] font-mono tracking-wider text-teal-300/80">
                  SWAAS · Alpine Command
                </span>
              </div>
            )}
          </Link>

          {/* Mini-Rail Collapse Toggle */}
          <button
            type="button"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand sidebar ( [ )" : "Collapse sidebar ( [ )"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-white/10 bg-white/5 text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition hover:border-teal-400/50 hover:bg-teal-500/10 hover:text-teal-300 cursor-pointer"
          >
            {isCollapsed ? (
              <HiOutlineChevronRight className="h-4 w-4 text-[var(--brand-teal)]" />
            ) : (
              <HiOutlineChevronLeft className="h-4 w-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* =========================================================
            COMMAND SHORTCUT TRIGGER (⌘K SEARCH) - Available in Both Modes
            ======================================================= */}
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            title="Quick Incident & Action Search ( ⌘K )"
            aria-label="Search incidents"
            className="mb-3 flex h-9 w-9 self-center items-center justify-center rounded-[var(--radius-lg)] border border-white/[0.09] bg-[var(--brand-navy-card-bg)] text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition hover:border-teal-400/50 hover:bg-teal-500/10 hover:text-teal-300 cursor-pointer"
          >
            <HiOutlineMagnifyingGlass className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            title="Quick Incident & Telemetry Jump ( ⌘K )"
            className="mb-3 flex w-full items-center justify-between rounded-[var(--radius-xl)] border border-white/[0.09] bg-[var(--brand-navy-card-bg)] px-3 py-2 text-xs text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.2)] backdrop-blur-md transition hover:border-teal-400/40 hover:bg-[var(--brand-navy-card-hover)] hover:text-white cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HiOutlineMagnifyingGlass className="h-4 w-4 text-[var(--brand-teal)]" />
              <span>Search incidents…</span>
            </div>
            <kbd className="rounded-[var(--radius-sm)] bg-black/40 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-teal-300 border border-teal-500/25 shadow-sm">
              ⌘K
            </kbd>
          </button>
        )}

        {/* =========================================================
            UNIFIED TELEMETRY STATUS STRIP (TACTICAL HUD)
            ======================================================= */}
        {isCollapsed ? (
          <div
            className="mb-3 flex h-8 w-8 self-center items-center justify-center rounded-[var(--radius-lg)] border border-white/[0.09] bg-[var(--brand-navy-card-bg)] shadow-sm"
            title={`Cloud WebSocket: ${connected ? "Active" : "Offline"} | Wearable BLE: ${bleConnected ? "Linked" : "Standby"}`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {connected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  connected
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                    : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]"
                }`}
              />
            </span>
          </div>
        ) : (
          <div className="mb-3 flex items-center justify-between rounded-[var(--radius-xl)] border border-white/[0.09] bg-[var(--brand-navy-card-bg)] px-3 py-2 font-mono text-[10px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all">
            {/* Cloud WebSocket Link */}
            <div
              className="flex items-center gap-1.5"
              title={connected ? "Cloud Telemetry WebSocket: Active" : "Cloud Telemetry WebSocket: Offline"}
            >
              {connected ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full shrink-0 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
              )}
              <span className={connected ? "text-emerald-400 font-semibold tracking-wider" : "text-rose-400 font-semibold tracking-wider"}>
                {connected ? "WS ACTIVE" : "WS OFFLINE"}
              </span>
            </div>

            {/* Bluetooth Sensor Link */}
            <div
              className="flex items-center gap-1.5"
              title={bleConnected ? "Wearable BLE: Linked" : "Wearable BLE: Standby"}
            >
              <HiOutlineSignal
                className={`h-3.5 w-3.5 shrink-0 ${
                  bleConnected ? "text-[var(--brand-teal)] drop-shadow-[0_0_6px_rgba(45,212,191,0.6)]" : "text-slate-400"
                }`}
              />
              <span className={bleConnected ? "text-[var(--brand-teal)] font-semibold tracking-wider" : "text-slate-400 tracking-wider"}>
                {bleConnected ? "BLE LINKED" : "BLE STANDBY"}
              </span>
            </div>
          </div>
        )}

        {/* =========================================================
            ACTIVE EMERGENCY INCIDENT BEACON (CROSS-PAGE ALERT)
            ======================================================= */}
        {activeFall && (
          <Link
            to="/dashboard"
            title="Active Emergency Fall Detected - Click for live rescue triage"
            className={`mb-3 block rounded-[var(--radius-xl)] border border-rose-500/70 bg-rose-950/60 p-2.5 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition hover:border-rose-400 animate-pulse ${
              isCollapsed ? "text-center" : ""
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-400">
              <HiOutlineExclamationTriangle className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>ACTIVE INCIDENT DETECTED</span>}
            </div>
            {!isCollapsed && (
              <p className="mt-1 text-[11px] text-slate-300 leading-tight">
                Kinematic shock recorded. Click to open live emergency triage.
              </p>
            )}
          </Link>
        )}

        {/* =========================================================
            PRIMARY NAVIGATION
            ======================================================= */}
        <nav className="flex flex-col gap-1.5">
          {PRIMARY_NAV_ITEMS.map(({ to, label, icon: Icon, hasAlertBadge }) => (
            <NavLink
              key={to}
              to={to}
              viewTransition
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-[var(--radius-xl)] px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isCollapsed ? "justify-center px-2" : ""
                } ${
                  isActive
                    ? "border border-teal-500/40 bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-transparent font-semibold text-[var(--brand-teal-light)] shadow-[0_0_16px_rgba(45,212,191,0.18)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r before:bg-teal-400 before:shadow-[0_0_10px_rgba(45,212,191,0.85)]"
                    : "text-slate-300 hover:bg-white/[0.08] hover:text-white hover:translate-x-0.5"
                }`
              }
            >
              <div className="relative shrink-0 flex items-center justify-center">
                <Icon className="text-[20px]" />
                {hasAlertBadge && activeFall && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[var(--brand-navy)] animate-ping" />
                )}
              </div>

              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <span className="truncate">{label}</span>
                  {hasAlertBadge && activeFall && (
                    <span className="rounded-full bg-rose-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-rose-300 border border-rose-500/50">
                      1
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* =========================================================
            HARDWARE WEARABLE STATUS CARD (Tactical Alpine Aesthetic)
            ======================================================= */}
        <div className="mt-3.5 space-y-2">
          {selectedDevice ? (
            <div
              className={`rounded-[var(--card-radius-compact)] border border-white/[0.09] bg-[var(--brand-navy-card-bg)] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_6px_20px_rgba(0,0,0,0.3)] backdrop-blur-md ${
                isCollapsed ? "text-center px-1 py-2" : ""
              }`}
            >
              {isCollapsed ? (
                <Link
                  to="/settings"
                  title={`Paired Wearable: ${deviceName} | ${
                    batteryPercent != null ? `Battery: ${batteryPercent}%` : "100%"
                  }`}
                  className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-[var(--radius-xl)] text-slate-300 hover:text-[var(--brand-teal)] transition cursor-pointer self-center"
                >
                  <HiOutlineCpuChip className="h-5 w-5 text-[var(--brand-teal)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                </Link>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                        </span>
                        <span className="text-[12px] font-semibold text-white truncate">
                          {deviceName}
                        </span>
                        {(!lastSeenText || lastSeenText === "Just now") && (
                          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[8px] font-bold text-emerald-400 tracking-wider">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400 tracking-wide">
                        {maskDeviceId(selectedDevice.deviceId)}
                      </p>
                    </div>

                    {/* Live Battery Indicator with Electric Teal Glow */}
                    <div
                      className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-teal-400/10 border border-teal-400/25 px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--brand-teal-light)] shadow-[0_0_8px_rgba(45,212,191,0.15)]"
                      title={
                        batteryPercent != null
                          ? `Battery Level: ${batteryPercent}%${isCharging ? " (Charging)" : ""}`
                          : "Wearable Power: Optimal"
                      }
                    >
                      {isCharging ? (
                        <IoBatteryChargingOutline className="h-3.5 w-3.5 text-teal-300 animate-pulse" />
                      ) : (
                        <IoBatteryFullOutline className="h-3.5 w-3.5 text-teal-300" />
                      )}
                      <span>{batteryPercent != null ? `${batteryPercent}%` : "100%"}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="truncate">Last seen: {lastSeenText || "Live"}</span>
                    <Link
                      to="/settings"
                      className="flex items-center gap-1 text-[var(--brand-teal)] hover:text-[var(--brand-teal-hover)] transition cursor-pointer"
                    >
                      <HiOutlineCog6Tooth className="h-3.5 w-3.5" />
                      <span>Manage</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div
              className={`rounded-[var(--card-radius-compact)] border border-dashed border-white/15 bg-white/5 p-3.5 ${
                isCollapsed ? "text-center px-1 py-2" : ""
              }`}
            >
              {isCollapsed ? (
                <Link
                  to="/settings"
                  title="Pair ESP32-S3 Wearable Sensor"
                  className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-xl)] text-slate-400 hover:text-[var(--brand-teal)] transition self-center"
                >
                  <HiOutlineCpuChip className="h-5 w-5 opacity-40 hover:opacity-100" />
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-200">
                      No Device Paired
                    </span>
                    <p className="text-[9px] text-slate-400">
                      Pair ESP32-S3 sensor
                    </p>
                  </div>
                  <Link
                    to="/settings"
                    className="rounded-[var(--radius-button)] bg-[var(--brand-teal)] px-2.5 py-1 text-[10px] font-bold text-[var(--brand-navy-text)] transition hover:bg-[var(--brand-teal-hover)] cursor-pointer"
                  >
                    Pair
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================
            SECONDARY UTILITIES: ABOUT & PROTOCOLS (Uniform Heroicon)
            ======================================================= */}
        <div className="mt-auto pt-3">
          <NavLink
            to="/about"
            viewTransition
            title={isCollapsed ? "About & Protocols" : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[var(--radius-xl)] px-3 py-2 text-xs font-medium transition ${
                isCollapsed ? "justify-center px-2" : ""
              } ${
                isActive
                  ? "border border-teal-500/30 bg-[var(--brand-teal-subtle)] font-semibold text-[var(--brand-teal-light)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <HiOutlineDocumentText className="text-[18px] shrink-0 text-slate-400" />
            {!isCollapsed && <span>About & Protocols</span>}
          </NavLink>
        </div>

        {/* =========================================================
            PERSISTENT OPERATOR ACCOUNT & THEME / LOGOUT FOOTER
            ======================================================= */}
        <div className="mt-2 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center justify-between gap-2">
            <div
              className={`flex items-center gap-2.5 min-w-0 ${
                isCollapsed ? "justify-center w-full" : ""
              }`}
            >
              <div
                title={`${userName} (${userRole})`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-teal-500 to-blue-600 font-mono text-xs font-bold text-white shadow-[0_0_12px_rgba(45,212,191,0.3)] ring-1 ring-teal-400/30 cursor-default"
              >
                {userInitials || "OP"}
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-white">
                      {userName}
                    </span>
                    <span className="rounded-[var(--radius-xs)] bg-teal-400/15 border border-teal-400/30 px-1 py-0.2 font-mono text-[8px] text-[var(--brand-teal-light)] font-bold tracking-wider">
                      {userRole}
                    </span>
                  </div>
                  <span className="truncate text-[10px] text-slate-400 font-mono">
                    {user?.email || "operator@trailguard.com"}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex items-center gap-1 shrink-0">
                {/* 1-Click Theme Switcher */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
                  aria-label="Toggle Theme"
                  className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] border border-white/10 bg-white/5 text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition hover:border-teal-400/40 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  {isDark ? (
                    <HiOutlineSun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <HiOutlineMoon className="h-4 w-4 text-[var(--brand-teal)]" />
                  )}
                </button>

                {/* Quick Logout Button */}
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out of console"
                  aria-label="Sign out"
                  className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] border border-white/10 bg-white/5 text-slate-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
                >
                  <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Interactive Command & Incident Search Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </aside>
  );
}
