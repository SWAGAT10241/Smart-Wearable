import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiSettings,
  FiActivity,
  FiDownload,
  FiMapPin,
  FiX,
  FiChevronRight,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { IoAlertCircleOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { useLiveData } from "../../context/LiveDataContext";
import { useDevices } from "../../context/DeviceContext";
import { useTheme } from "../../context/ThemeContext";

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Safe context access for isolated test environments
  let liveData = {};
  try {
    liveData = useLiveData() || {};
  } catch {
    liveData = {};
  }
  const activeFall = liveData.activeFall;

  let deviceState = {};
  try {
    deviceState = useDevices() || {};
  } catch {
    deviceState = {};
  }
  const selectedDevice = deviceState.selectedDevice;

  let themeState = {};
  try {
    themeState = useTheme() || {};
  } catch {
    themeState = {};
  }
  const isDark = themeState.isDark ?? true;
  const toggleTheme = themeState.toggleTheme;

  // Auto-focus search input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Global ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search items definition
  const allItems = useMemo(() => {
    const items = [];

    // 1. Active Incident Alert if present
    if (activeFall) {
      items.push({
        id: "active-incident",
        category: "Emergency Alert",
        label: "Jump to Active Emergency Fall Incident",
        description: "Kinematic shock recorded — open live triage room",
        icon: IoAlertCircleOutline,
        badge: "CRITICAL",
        badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/40",
        action: () => {
          navigate("/dashboard");
          onClose();
        },
      });
    }

    // 2. Primary Navigation
    items.push(
      {
        id: "nav-dashboard",
        category: "Navigation",
        label: "Mission Command Dashboard",
        description: "Live vitals, tactical map, and real-time telemetry",
        icon: HiOutlineSquares2X2,
        action: () => {
          navigate("/dashboard");
          onClose();
        },
      },
      {
        id: "nav-history",
        category: "Navigation",
        label: "Telemetry & Incident History",
        description: "Past hikes, sensor readings, and incident replay logs",
        icon: MdHistory,
        action: () => {
          navigate("/history");
          onClose();
        },
      },
      {
        id: "nav-settings",
        category: "Navigation",
        label: "Hardware & Account Settings",
        description: "Sensor pairing, emergency contacts, profile configuration",
        icon: FiSettings,
        action: () => {
          navigate("/settings");
          onClose();
        },
      },
      {
        id: "nav-about",
        category: "Navigation",
        label: "Architecture & Protocols",
        description: "4-tier architecture, Ed25519 auth, and emergency guidelines",
        icon: IoShieldCheckmarkOutline,
        action: () => {
          navigate("/about");
          onClose();
        },
      }
    );

    // 3. Quick Actions
    items.push(
      {
        id: "action-pair",
        category: "Tactical Actions",
        label: "Pair New ESP32-S3 Wearable",
        description: "Provision cryptographic Ed25519 sensor device",
        icon: FiActivity,
        badge: selectedDevice ? "PAIRED" : "STANDBY",
        badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
        action: () => {
          navigate("/settings");
          onClose();
        },
      },
      {
        id: "action-map",
        category: "Tactical Actions",
        label: "Open Fullscreen Tactical Map",
        description: "View MapLibre terrain and live GPS tracking trace",
        icon: FiMapPin,
        action: () => {
          navigate("/dashboard#map");
          onClose();
        },
      },
      {
        id: "action-export",
        category: "Tactical Actions",
        label: "Export Telemetry Audit Log",
        description: "Download verified incident CSV & cryptographic receipt",
        icon: FiDownload,
        action: () => {
          navigate("/history");
          onClose();
        },
      }
    );

    // 4. Quick Preferences
    if (toggleTheme) {
      items.push({
        id: "pref-theme",
        category: "Preferences",
        label: isDark ? "Switch to High-Contrast Light Theme" : "Switch to Alpine Night Dark Theme",
        description: "Toggle console color profile between day patrol and night recon",
        icon: isDark ? FiSun : FiMoon,
        badge: isDark ? "NIGHT" : "DAY",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        action: () => {
          toggleTheme();
          onClose();
        },
      });
    }

    return items;
  }, [activeFall, selectedDevice, isDark, toggleTheme, navigate, onClose]);

  // Filter items based on user query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  // Keyboard navigation inside modal list
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Incident Search & Command Palette"
      className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-20 sm:pt-28 backdrop-blur-md bg-slate-950/75 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-[var(--modal-radius,24px)] border border-white/15 bg-[var(--brand-navy-deep,#04101d)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <FiSearch className="h-5 w-5 text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search incidents, tactical actions, or navigate…"
            className="flex-1 bg-transparent text-sm font-medium text-white placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded-[var(--radius-xs,2px)] bg-black/40 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-400 border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FiSearch className="mx-auto h-8 w-8 text-slate-500 mb-2 opacity-60" />
              <p className="text-sm font-medium">No matching incidents or actions found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching "dashboard", "fall", or "settings"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-center justify-between gap-3 rounded-[var(--radius-xl,16px)] px-3.5 py-2.5 text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-teal-500/15 border border-teal-500/30 text-white shadow-[0_0_12px_rgba(45,212,191,0.12)]"
                        : "border border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-lg,12px)] border ${
                          isSelected
                            ? "border-teal-400/40 bg-teal-400/20 text-[var(--brand-teal,#2dd4bf)]"
                            : "border-white/10 bg-white/5 text-slate-400"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`rounded-[var(--radius-xs,2px)] border px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                                item.badgeColor || "bg-white/10 text-slate-300 border-white/20"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <FiChevronRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected ? "text-[var(--brand-teal,#2dd4bf)] translate-x-0.5" : "text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/30 px-4 py-2 font-mono text-[10px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-black/40 px-1 py-0.5 border border-white/10 text-slate-300">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="rounded bg-black/40 px-1 py-0.5 border border-white/10 text-slate-300">↵</kbd> Select
            </span>
          </div>
          <span className="text-teal-300/80">TrailGuard Command Palette</span>
        </div>
      </div>
    </div>
  );
}
