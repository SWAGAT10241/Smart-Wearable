import { useState, useEffect, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineBars3,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import {
  IoWatchOutline,
  IoBatteryFullOutline,
  IoBatteryChargingOutline,
} from "react-icons/io5";

import { useDevices } from "../context/DeviceContext";
import { useLiveData } from "../context/LiveDataContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import loginBackground from "../assets/images/login-background.png";
import "./Sidebar.css";

const NAVIGATION_SECTIONS = [
  {
    title: "OPERATIONS",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2, badge: "LIVE" },
      { to: "/history", label: "Incident History", icon: HiOutlineClock },
    ],
  },
  {
    title: "CONFIGURATION",
    items: [
      { to: "/settings", label: "Settings", icon: HiOutlineCog6Tooth },
      { to: "/about", label: "About", icon: HiOutlineDocumentText },
    ],
  },
];

export default function Sidebar() {
  const { selectedDevice } = useDevices();

  // Persistent collapsible rail state
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

  // Hotkey: "[" toggles rail
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }
      if (e.key === "[" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapse]);

  // Safe Context Access
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
    themeState = useTheme() || { isDark: true, toggleTheme: () => {} };
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
  const deviceStatus = liveData.deviceStatus;
  const vitals = liveData.vitals;

  const isDeviceActive = bleConnected || connected || Boolean(selectedDevice);
  const batteryPercent =
    deviceStatus?.batteryPercent ?? vitals?.batteryPercent ?? (selectedDevice ? 94 : null);
  const isCharging = deviceStatus?.charging ?? vitals?.charging ?? false;

  const deviceName =
    selectedDevice?.deviceName || selectedDevice?.name || "TrailGuard Wearable";

  const userName = user?.name || user?.fullName || user?.username || "Operator";
  const userInitials = userName
    .split(/[\s_]+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const userRole = (user?.role || "Rescue Lead").toUpperCase();

  return (
    <aside
      role="navigation"
      aria-label="Main Navigation"
      className={`tg-sidebar ${isCollapsed ? "is-collapsed" : ""}`}
    >
      {/* Wilderness Terrain Atmosphere Background Overlay */}
      <div
        className="tg-sidebar-bg-image"
        style={{ backgroundImage: `url(${loginBackground})` }}
        aria-hidden="true"
      />
      <div className="tg-sidebar-bg-gradient" aria-hidden="true" />

      {/* =========================================================
          TOP: WORKSPACE BRAND & HAMBURGER COLLAPSE TOGGLE
          ======================================================= */}
      <div className="tg-sidebar-header">
        {isCollapsed ? (
          <button
            type="button"
            onClick={toggleCollapse}
            title="Expand sidebar (or press [)"
            aria-label="Expand sidebar"
            className="tg-sidebar-collapse-btn"
          >
            <HiOutlineBars3 style={{ width: 18, height: 18 }} />
          </button>
        ) : (
          <>
            <Link to="/dashboard" className="tg-sidebar-brand">
              <div className="tg-sidebar-brand-icon-box">
                <HiOutlineShieldCheck style={{ width: 20, height: 20 }} />
              </div>

              <div className="tg-sidebar-brand-text">
                <div className="tg-sidebar-brand-title-row">
                  <span className="tg-sidebar-brand-title">
                    Trail<span className="accent">Guard</span>
                  </span>
                  <span className="tg-sidebar-brand-tag">RESCUE</span>
                </div>
                <span className="tg-sidebar-brand-subtitle">Safety System</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              title="Collapse sidebar (or press [)"
              aria-label="Collapse sidebar"
              className="tg-sidebar-collapse-btn"
            >
              <HiOutlineBars3 style={{ width: 16, height: 16 }} />
            </button>
          </>
        )}
      </div>

      {/* =========================================================
          ACTIVE WEARABLE HARDWARE STATUS CARD
          ======================================================= */}
      <div className="tg-sidebar-device-container">
        {isCollapsed ? (
          <Link
            to="/settings"
            title={`${deviceName} • ${isDeviceActive ? "Connected" : "Standby"} • ${batteryPercent !== null ? batteryPercent + "%" : ""}`}
            className="tg-sidebar-device-mini"
          >
            <div className="tg-sidebar-mini-icon-wrap">
              <IoWatchOutline
                style={{
                  width: 20,
                  height: 20,
                  color: isDeviceActive ? "var(--brand-teal, #2dd4bf)" : "#64748b",
                }}
              />
              <span
                className={`tg-sidebar-status-dot ${isDeviceActive ? "active" : "idle"}`}
                style={{ position: "absolute", top: -2, right: -2 }}
              />
            </div>
            {batteryPercent !== null && (
              <span className="tg-sidebar-mini-battery">{batteryPercent}%</span>
            )}
          </Link>
        ) : (
          <Link
            to="/settings"
            title="Configure device in Settings"
            className="tg-sidebar-device-card"
          >
            <div className="tg-sidebar-device-main">
              <div className="tg-sidebar-device-icon-box">
                <IoWatchOutline style={{ width: 18, height: 18 }} />
              </div>

              <div className="tg-sidebar-device-info">
                <span className="tg-sidebar-device-name">{deviceName}</span>
                <div className="tg-sidebar-device-status-row">
                  <span
                    className={`tg-sidebar-status-dot ${isDeviceActive ? "active" : "idle"}`}
                  />
                  <span className="tg-sidebar-device-status-text">
                    {isDeviceActive ? "BLE Connected" : "Standby"}
                  </span>
                </div>
              </div>
            </div>

            {batteryPercent !== null && (
              <div className="tg-sidebar-device-battery">
                {isCharging ? (
                  <IoBatteryChargingOutline
                    style={{ width: 14, height: 14, color: "#34d399" }}
                  />
                ) : (
                  <IoBatteryFullOutline
                    style={{ width: 14, height: 14, color: "var(--brand-teal, #2dd4bf)" }}
                  />
                )}
                <span>{batteryPercent}%</span>
              </div>
            )}
          </Link>
        )}
      </div>

      {/* =========================================================
          STRUCTURED NAVIGATION LIST
          ======================================================= */}
      <div className="tg-sidebar-nav-container">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title} className="tg-sidebar-section">
            {!isCollapsed && (
              <div className="tg-sidebar-section-title">{section.title}</div>
            )}

            {section.items.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                viewTransition
                title={isCollapsed ? label : undefined}
                className={({ isActive }) =>
                  `tg-sidebar-nav-item ${isActive ? "active" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="tg-sidebar-nav-icon" />
                    {!isCollapsed && (
                      <span className="tg-sidebar-nav-label">{label}</span>
                    )}

                    {!isCollapsed && badge && (
                      <span className="tg-sidebar-live-badge">
                        <span className="tg-sidebar-live-dot" />
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* =========================================================
          BOTTOM PINNED FOOTER: OPERATOR AVATAR, THEME & LOGOUT
          ======================================================= */}
      <div className="tg-sidebar-footer">
        <div className="tg-sidebar-user-block">
          <div
            title={`${userName} (${userRole})`}
            className="tg-sidebar-user-avatar"
          >
            {userInitials || "OP"}
          </div>

          {!isCollapsed && (
            <div className="tg-sidebar-user-meta">
              <span className="tg-sidebar-user-name">{userName}</span>
              <span className="tg-sidebar-user-email">
                {user?.email || "operator@trailguard.com"}
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="tg-sidebar-footer-actions">
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
              className="tg-sidebar-action-btn"
            >
              {isDark ? (
                <HiOutlineSun style={{ width: 15, height: 15, color: "#fbbf24" }} />
              ) : (
                <HiOutlineMoon
                  style={{ width: 15, height: 15, color: "var(--brand-teal, #2dd4bf)" }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
              className="tg-sidebar-action-btn logout"
            >
              <HiOutlineArrowRightOnRectangle style={{ width: 15, height: 15 }} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
