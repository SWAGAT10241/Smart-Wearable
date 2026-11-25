import React from "react";
import { IoTimeOutline } from "react-icons/io5";
import useUpdatedTime from "../hooks/useUpdatedTime";
import { useTheme } from "../context/ThemeContext";
import MiniStats from "./common/MiniStats";
import { LineTrace, BarTrace, GaugeBar, TemperatureGauge } from "./charts";

/* =======================================================
 * Sensor Visual Styles (Theme-Adaptive & Subtle Glows)
 * ======================================================= */
const STATUS_COLORS = {
  dark: {
    live: {
      text: "oklch(0.92 0.18 155)",
      bg: "oklch(0.45 0.15 155 / 0.25)",
      border: "oklch(0.68 0.18 155 / 0.50)",
      dot: "oklch(0.88 0.20 155)",
    },
    normal: {
      text: "oklch(0.92 0.18 155)",
      bg: "oklch(0.45 0.15 155 / 0.25)",
      border: "oklch(0.68 0.18 155 / 0.50)",
      dot: "oklch(0.88 0.20 155)",
    },
    optimal: {
      text: "oklch(0.92 0.18 155)",
      bg: "oklch(0.45 0.15 155 / 0.25)",
      border: "oklch(0.68 0.18 155 / 0.50)",
      dot: "oklch(0.88 0.20 155)",
    },
    nominal: {
      text: "oklch(0.92 0.18 155)",
      bg: "oklch(0.45 0.15 155 / 0.25)",
      border: "oklch(0.68 0.18 155 / 0.50)",
      dot: "oklch(0.88 0.20 155)",
    },
    mild: {
      text: "oklch(0.92 0.18 70)",
      bg: "oklch(0.50 0.15 70 / 0.25)",
      border: "oklch(0.72 0.18 70 / 0.50)",
      dot: "oklch(0.88 0.18 70)",
    },
    warning: {
      text: "oklch(0.92 0.18 70)",
      bg: "oklch(0.50 0.15 70 / 0.25)",
      border: "oklch(0.72 0.18 70 / 0.50)",
      dot: "oklch(0.88 0.18 70)",
    },
    alert: {
      text: "oklch(0.92 0.22 25)",
      bg: "oklch(0.50 0.18 25 / 0.28)",
      border: "oklch(0.70 0.22 25 / 0.55)",
      dot: "oklch(0.88 0.22 25)",
    },
    sos: {
      text: "oklch(0.92 0.22 25)",
      bg: "oklch(0.50 0.18 25 / 0.28)",
      border: "oklch(0.70 0.22 25 / 0.55)",
      dot: "oklch(0.88 0.22 25)",
    },
    low: {
      text: "oklch(0.92 0.18 70)",
      bg: "oklch(0.50 0.15 70 / 0.25)",
      border: "oklch(0.72 0.18 70 / 0.50)",
      dot: "oklch(0.88 0.18 70)",
    },
    high: {
      text: "oklch(0.92 0.22 25)",
      bg: "oklch(0.50 0.18 25 / 0.28)",
      border: "oklch(0.70 0.22 25 / 0.55)",
      dot: "oklch(0.88 0.22 25)",
    },
    cold: {
      text: "oklch(0.92 0.14 230)",
      bg: "oklch(0.45 0.12 230 / 0.25)",
      border: "oklch(0.68 0.14 230 / 0.50)",
      dot: "oklch(0.85 0.16 230)",
    },
    humid: {
      text: "oklch(0.92 0.18 70)",
      bg: "oklch(0.50 0.15 70 / 0.25)",
      border: "oklch(0.72 0.18 70 / 0.50)",
      dot: "oklch(0.88 0.18 70)",
    },
    dry: {
      text: "oklch(0.92 0.18 70)",
      bg: "oklch(0.50 0.15 70 / 0.25)",
      border: "oklch(0.72 0.18 70 / 0.50)",
      dot: "oklch(0.88 0.18 70)",
    },
    standby: {
      text: "oklch(0.88 0.04 250)",
      bg: "rgba(255, 255, 255, 0.12)",
      border: "rgba(255, 255, 255, 0.24)",
      dot: "oklch(0.82 0.04 250)",
    },
  },
  light: {
    live: {
      text: "oklch(0.24 0.18 155)",
      bg: "oklch(0.92 0.10 155 / 0.95)",
      border: "oklch(0.45 0.18 155 / 0.55)",
      dot: "oklch(0.38 0.22 155)",
    },
    normal: {
      text: "oklch(0.24 0.18 155)",
      bg: "oklch(0.92 0.10 155 / 0.95)",
      border: "oklch(0.45 0.18 155 / 0.55)",
      dot: "oklch(0.38 0.22 155)",
    },
    optimal: {
      text: "oklch(0.24 0.18 155)",
      bg: "oklch(0.92 0.10 155 / 0.95)",
      border: "oklch(0.45 0.18 155 / 0.55)",
      dot: "oklch(0.38 0.22 155)",
    },
    nominal: {
      text: "oklch(0.24 0.18 155)",
      bg: "oklch(0.92 0.10 155 / 0.95)",
      border: "oklch(0.45 0.18 155 / 0.55)",
      dot: "oklch(0.38 0.22 155)",
    },
    mild: {
      text: "oklch(0.28 0.18 65)",
      bg: "oklch(0.92 0.12 65 / 0.95)",
      border: "oklch(0.48 0.18 65 / 0.55)",
      dot: "oklch(0.42 0.20 65)",
    },
    warning: {
      text: "oklch(0.28 0.18 65)",
      bg: "oklch(0.92 0.12 65 / 0.95)",
      border: "oklch(0.48 0.18 65 / 0.55)",
      dot: "oklch(0.42 0.20 65)",
    },
    alert: {
      text: "oklch(0.26 0.24 25)",
      bg: "oklch(0.92 0.11 25 / 0.95)",
      border: "oklch(0.48 0.24 25 / 0.55)",
      dot: "oklch(0.38 0.24 25)",
    },
    sos: {
      text: "oklch(0.26 0.24 25)",
      bg: "oklch(0.92 0.11 25 / 0.95)",
      border: "oklch(0.48 0.24 25 / 0.55)",
      dot: "oklch(0.38 0.24 25)",
    },
    low: {
      text: "oklch(0.28 0.18 65)",
      bg: "oklch(0.92 0.12 65 / 0.95)",
      border: "oklch(0.48 0.18 65 / 0.55)",
      dot: "oklch(0.42 0.20 65)",
    },
    high: {
      text: "oklch(0.26 0.24 25)",
      bg: "oklch(0.92 0.11 25 / 0.95)",
      border: "oklch(0.48 0.24 25 / 0.55)",
      dot: "oklch(0.38 0.24 25)",
    },
    cold: {
      text: "oklch(0.24 0.16 230)",
      bg: "oklch(0.92 0.10 230 / 0.95)",
      border: "oklch(0.45 0.16 230 / 0.55)",
      dot: "oklch(0.35 0.18 230)",
    },
    humid: {
      text: "oklch(0.28 0.18 65)",
      bg: "oklch(0.92 0.12 65 / 0.95)",
      border: "oklch(0.48 0.18 65 / 0.55)",
      dot: "oklch(0.42 0.20 65)",
    },
    dry: {
      text: "oklch(0.28 0.18 65)",
      bg: "oklch(0.92 0.12 65 / 0.95)",
      border: "oklch(0.48 0.18 65 / 0.55)",
      dot: "oklch(0.42 0.20 65)",
    },
    standby: {
      text: "oklch(0.28 0.04 250)",
      bg: "rgba(255, 255, 255, 0.95)",
      border: "rgba(0, 0, 0, 0.22)",
      dot: "oklch(0.38 0.04 250)",
    },
  },
};

const STYLES = {
  heart: {
    color: "oklch(0.48 0.28 22)",
    darkColor: "oklch(0.72 0.20 22)",
    lightBg:
      "linear-gradient(175deg, oklch(0.86 0.13 22) 0%, oklch(0.93 0.05 22) 42%, oklch(0.97 0.02 22) 100%)",
    darkBg:
      "linear-gradient(180deg, oklch(0.21 0.050 22 / 0.75) 0%, rgba(15, 23, 42, 0.95) 45%, #0b0f19 100%)",
    dropletColor: "oklch(0.50 0.28 22)",
    dropletDeep: "oklch(0.34 0.26 22)",
    dropletDarkBase: "rgba(15, 23, 42, 0.90)",
    dropletDarkRim: "oklch(0.62 0.12 22 / 0.50)",
    lightHairline:
      "linear-gradient(90deg, transparent, oklch(0.48 0.28 22), transparent)",
    darkHairline:
      "linear-gradient(90deg, transparent, oklch(0.72 0.20 22 / 0.70), transparent)",
    lightBorder: "oklch(0.48 0.28 22 / 0.75)",
    darkBorder: "oklch(0.58 0.12 22 / 0.35)",
    lightShadow:
      "0 14px 34px -4px oklch(0.50 0.28 22 / 0.30), 0 4px 12px -2px oklch(0.50 0.28 22 / 0.18)",
    darkShadow:
      "0 10px 25px -3px rgba(0, 0, 0, 0.60), 0 4px 10px -2px rgba(0, 0, 0, 0.40)",
  },
  oxygen: {
    color: "oklch(0.42 0.22 155)",
    darkColor: "oklch(0.74 0.18 155)",
    lightBg:
      "linear-gradient(175deg, oklch(0.86 0.11 155) 0%, oklch(0.93 0.05 155) 42%, oklch(0.97 0.02 155) 100%)",
    darkBg:
      "linear-gradient(180deg, oklch(0.21 0.045 155 / 0.75) 0%, rgba(15, 23, 42, 0.95) 45%, #0b0f19 100%)",
    dropletColor: "oklch(0.44 0.22 155)",
    dropletDeep: "oklch(0.32 0.20 155)",
    dropletDarkBase: "rgba(15, 23, 42, 0.90)",
    dropletDarkRim: "oklch(0.62 0.11 155 / 0.50)",
    lightHairline:
      "linear-gradient(90deg, transparent, oklch(0.44 0.22 155), transparent)",
    darkHairline:
      "linear-gradient(90deg, transparent, oklch(0.74 0.18 155 / 0.70), transparent)",
    lightBorder: "oklch(0.44 0.22 155 / 0.75)",
    darkBorder: "oklch(0.58 0.11 155 / 0.35)",
    lightShadow:
      "0 14px 34px -4px oklch(0.44 0.22 155 / 0.30), 0 4px 12px -2px oklch(0.44 0.22 155 / 0.18)",
    darkShadow:
      "0 10px 25px -3px rgba(0, 0, 0, 0.60), 0 4px 10px -2px rgba(0, 0, 0, 0.40)",
  },
  temperature: {
    color: "oklch(0.48 0.22 45)",
    darkColor: "oklch(0.76 0.17 55)",
    lightBg:
      "linear-gradient(175deg, oklch(0.87 0.12 55) 0%, oklch(0.93 0.05 55) 42%, oklch(0.97 0.02 55) 100%)",
    darkBg:
      "linear-gradient(180deg, oklch(0.21 0.045 55 / 0.75) 0%, rgba(15, 23, 42, 0.95) 45%, #0b0f19 100%)",
    dropletColor: "oklch(0.50 0.24 55)",
    dropletDeep: "oklch(0.38 0.22 50)",
    dropletDarkBase: "rgba(15, 23, 42, 0.90)",
    dropletDarkRim: "oklch(0.62 0.11 55 / 0.50)",
    lightHairline:
      "linear-gradient(90deg, transparent, oklch(0.50 0.24 55), transparent)",
    darkHairline:
      "linear-gradient(90deg, transparent, oklch(0.76 0.17 55 / 0.70), transparent)",
    lightBorder: "oklch(0.50 0.24 55 / 0.75)",
    darkBorder: "oklch(0.58 0.11 55 / 0.35)",
    lightShadow:
      "0 14px 34px -4px oklch(0.50 0.24 55 / 0.30), 0 4px 12px -2px oklch(0.50 0.24 55 / 0.18)",
    darkShadow:
      "0 10px 25px -3px rgba(0, 0, 0, 0.60), 0 4px 10px -2px rgba(0, 0, 0, 0.40)",
  },
  humidity: {
    color: "oklch(0.42 0.22 235)",
    darkColor: "oklch(0.74 0.17 235)",
    lightBg:
      "linear-gradient(175deg, oklch(0.86 0.11 235) 0%, oklch(0.93 0.05 235) 42%, oklch(0.97 0.02 235) 100%)",
    darkBg:
      "linear-gradient(180deg, oklch(0.21 0.045 235 / 0.75) 0%, rgba(15, 23, 42, 0.95) 45%, #0b0f19 100%)",
    dropletColor: "oklch(0.44 0.22 235)",
    dropletDeep: "oklch(0.32 0.20 235)",
    dropletDarkBase: "rgba(15, 23, 42, 0.90)",
    dropletDarkRim: "oklch(0.62 0.11 235 / 0.50)",
    lightHairline:
      "linear-gradient(90deg, transparent, oklch(0.44 0.22 235), transparent)",
    darkHairline:
      "linear-gradient(90deg, transparent, oklch(0.74 0.17 235 / 0.70), transparent)",
    lightBorder: "oklch(0.44 0.22 235 / 0.75)",
    darkBorder: "oklch(0.58 0.11 235 / 0.35)",
    lightShadow:
      "0 14px 34px -4px oklch(0.44 0.22 235 / 0.30), 0 4px 12px -2px oklch(0.44 0.22 235 / 0.18)",
    darkShadow:
      "0 10px 25px -3px rgba(0, 0, 0, 0.60), 0 4px 10px -2px rgba(0, 0, 0, 0.40)",
  },
  pressure: {
    color: "oklch(0.42 0.26 280)",
    darkColor: "oklch(0.74 0.19 280)",
    lightBg:
      "linear-gradient(175deg, oklch(0.85 0.13 280) 0%, oklch(0.93 0.05 280) 42%, oklch(0.97 0.02 280) 100%)",
    darkBg:
      "linear-gradient(180deg, oklch(0.21 0.050 280 / 0.75) 0%, rgba(15, 23, 42, 0.95) 45%, #0b0f19 100%)",
    dropletColor: "oklch(0.40 0.28 280)",
    dropletDeep: "oklch(0.28 0.24 280)",
    dropletDarkBase: "rgba(15, 23, 42, 0.90)",
    dropletDarkRim: "oklch(0.62 0.12 280 / 0.50)",
    lightHairline:
      "linear-gradient(90deg, transparent, oklch(0.40 0.28 280), transparent)",
    darkHairline:
      "linear-gradient(90deg, transparent, oklch(0.74 0.19 280 / 0.70), transparent)",
    lightBorder: "oklch(0.40 0.28 280 / 0.75)",
    darkBorder: "oklch(0.58 0.12 280 / 0.35)",
    lightShadow:
      "0 14px 34px -4px oklch(0.40 0.28 280 / 0.30), 0 4px 12px -2px oklch(0.40 0.28 280 / 0.18)",
    darkShadow:
      "0 10px 25px -3px rgba(0, 0, 0, 0.60), 0 4px 10px -2px rgba(0, 0, 0, 0.40)",
  },
};

/**
 * Reusable Telemetry StatCard component.
 * Fully theme-adaptive: high contrast in both Light and Dark modes.
 */
export default function StatCard({
  icon,
  iconType,
  label,
  value,
  unit,
  status,
  statusColor = "var(--status-optimal)",
  variant = "plain",
  gaugePct = 0,
  miniStats = [],
  signal = [],
  normalRange,
  updatedAt,
}) {
  const style = STYLES[iconType] || STYLES.oxygen;
  const updatedText = useUpdatedTime(updatedAt);
  const displayStatus = status || (value !== "--" ? "Nominal" : "Standby");

  let isDark = false;
  try {
    const themeContext = useTheme();
    isDark = themeContext ? themeContext.isDark : false;
  } catch {
    isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
  }

  const statusThemeKey = isDark ? "dark" : "light";
  const statusKey = String(displayStatus || "").toLowerCase();
  const statusPalette = STATUS_COLORS[statusThemeKey] || STATUS_COLORS.light;
  const statusStyle = statusPalette[statusKey] || statusPalette.normal;

  const iconBoxBg = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.95)";
  const iconBoxBorder = isDark
    ? "rgba(255, 255, 255, 0.16)"
    : style.lightBorder;
  const iconBoxShadow = isDark
    ? "inset 0 1px 1px rgba(255, 255, 255, 0.10), 0 2px 6px rgba(0, 0, 0, 0.35)"
    : "0 2px 8px -1px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.95)";
  const iconColor = isDark ? (style.darkColor || style.color) : style.color;

  const currentBorder = isDark ? style.darkBorder : style.lightBorder;
  const currentHairline = isDark ? style.darkHairline : style.lightHairline;
  const currentCardBg = isDark ? style.darkBg : style.lightBg;
  const currentCardShadow = isDark ? style.darkShadow : style.lightShadow;

  const currentDropletGradient = isDark
    ? `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.15) 20%, ${style.dropletDarkRim} 55%, ${style.dropletDarkBase} 100%)`
    : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.35) 18%, ${style.dropletColor} 55%, ${style.dropletDeep} 100%)`;

  const currentDropletShadow = isDark
    ? `inset 0 1.5px 3px rgba(255,255,255,0.40), inset 0 -2px 4px ${style.dropletDarkRim}, 0 4px 12px rgba(0,0,0,0.50)`
    : `inset 0 2.5px 5px rgba(255,255,255,0.95), inset 0 -3px 6px ${style.dropletDeep}, 0 6px 14px -1px rgba(0,0,0,0.20), 0 2px 6px ${style.dropletColor}40`;

  const currentSatelliteGradient = isDark
    ? `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.15) 20%, ${style.dropletDarkRim} 60%, ${style.dropletDarkBase} 100%)`
    : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.35) 20%, ${style.dropletColor} 60%, ${style.dropletDeep} 100%)`;

  const currentMicroGradient = isDark
    ? `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.70) 0%, ${style.dropletDarkRim} 70%, ${style.dropletDarkBase} 100%)`
    : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98) 0%, ${style.dropletColor} 70%, ${style.dropletDeep} 100%)`;

  const currentRipple1Border = isDark
    ? "1px solid rgba(255, 255, 255, 0.06)"
    : "1.5px solid rgba(255, 255, 255, 0.75)";
  const currentRipple1Shadow = isDark
    ? "0 0 0 1px rgba(255, 255, 255, 0.03)"
    : `0 0 0 1px ${style.dropletColor}40, inset 0 0 16px ${style.dropletColor}25`;

  const currentRipple2Border = isDark
    ? "1px solid rgba(255, 255, 255, 0.03)"
    : "1px solid rgba(255, 255, 255, 0.50)";
  const currentRipple2Shadow = isDark
    ? "none"
    : `0 0 0 1px ${style.dropletColor}25`;

  return (
    <article
      className="group relative flex h-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-2xl"
      style={{
        background: currentCardBg,
        borderColor: currentBorder,
        boxShadow: currentCardShadow,
      }}
    >
      {/* Harmonized Liquid Ripple & 3D Water Droplet Layer (Shared Across Light & Dark) */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        aria-hidden="true"
      >
        {/* Ripple Wave 1 */}
        <div
          className="absolute top-2 right-2 h-44 w-44 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            border: currentRipple1Border,
            boxShadow: currentRipple1Shadow,
            opacity: isDark ? 0.20 : 0.85,
          }}
        />

        {/* Ripple Wave 2 */}
        <div
          className="absolute -top-4 -right-4 h-64 w-64 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            border: currentRipple2Border,
            boxShadow: currentRipple2Shadow,
            opacity: isDark ? 0.12 : 0.65,
          }}
        />

        {/* Primary 3D Water Droplet */}
        <div
          className="absolute top-9 right-4 h-9 w-9 rounded-full transition-transform duration-300"
          style={{
            borderRadius: "56% 44% 48% 52% / 60% 55% 45% 40%",
            background: currentDropletGradient,
            boxShadow: currentDropletShadow,
          }}
        >
          {/* Specular White Gleam */}
          <div
            className="absolute top-1 left-1.5 h-2 w-3.5 rounded-full rotate-[-35deg]"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.95)",
              filter: "blur(0.3px)",
            }}
          />
        </div>

        {/* Secondary 3D Water Droplet (Satellite drop) */}
        <div
          className="absolute top-3 right-28 h-5 w-5 rounded-full"
          style={{
            borderRadius: "52% 48% 46% 54% / 55% 58% 42% 45%",
            background: currentSatelliteGradient,
            boxShadow: isDark
              ? `inset 0 1px 2px rgba(255,255,255,0.40), inset 0 -1.5px 3px ${style.dropletDarkRim}, 0 3px 8px rgba(0,0,0,0.45)`
              : `inset 0 1.5px 3px rgba(255,255,255,0.9), inset 0 -2px 4px ${style.dropletDeep}, 0 3px 8px -1px rgba(0,0,0,0.20), 0 1px 4px ${style.dropletColor}`,
          }}
        >
          <div
            className="absolute top-0.5 left-1 h-1 w-1.5 rounded-full rotate-[-30deg]"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.50)" : "rgba(255, 255, 255, 0.90)",
            }}
          />
        </div>

        {/* Micro Bead Water Droplet 3 */}
        <div
          className="absolute top-14 right-16 h-3 w-3 rounded-full"
          style={{
            background: currentMicroGradient,
            boxShadow: isDark
              ? `inset 0 1px 2px rgba(255,255,255,0.40), 0 2px 4px rgba(0,0,0,0.45)`
              : `inset 0 1px 2px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.18)`,
          }}
        />
      </div>

      {/* Signature Top Hairline Accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px]"
        style={{
          background: currentHairline,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Metric Title, Icon & Status Flag */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${
                iconType === "heart" && value !== "--" ? "animate-cardiac-pulse" : ""
              }`}
              style={{
                background: iconBoxBg,
                borderColor: iconBoxBorder,
                boxShadow: iconBoxShadow,
                color: iconColor,
              }}
            >
              {icon}
            </div>

            <span className="truncate text-sm font-black tracking-wider text-slate-900 dark:text-white uppercase font-mono">
              {label}
            </span>
          </div>

          {/* Tactical Status Flag Pill */}
          <span
            className="shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono border backdrop-blur-sm shadow-xs"
            style={{
              background: statusStyle.bg,
              borderColor: statusStyle.border,
              color: statusStyle.text,
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full animate-pulse"
              style={{ background: statusStyle.dot }}
            />
            <span>{displayStatus}</span>
          </span>
        </div>

        {/* Current Big Metric Value */}
        <div className="mb-3 flex min-h-[38px] items-baseline gap-1.5">
          <span
            key={value}
            className="animate-telemetry-flash text-3xl font-black leading-none tracking-tight tabular-nums text-slate-950 dark:text-white"
          >
            {value}
          </span>

          {unit && (
            <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-300">
              {unit}
            </span>
          )}
        </div>

        {/* Recessed Tactical Display Screen (86px height across all 5 cards) */}
        <div className="mb-3 flex h-[86px] w-full flex-col justify-center overflow-hidden rounded-xl border border-black/15 dark:border-white/10 bg-white/75 dark:bg-black/35 backdrop-blur-md p-2 shadow-inner">
          {variant === "ppg" && (
            <LineTrace
              color={isDark ? style.darkColor : style.color}
              samples={signal}
              sensorType="heart"
              emptyText="Waiting for pulse data..."
            />
          )}

          {variant === "line" && (
            <LineTrace
              color={isDark ? style.darkColor : style.color}
              samples={signal}
            />
          )}

          {variant === "bars" && (
            <BarTrace
              color={isDark ? style.darkColor : style.color}
              samples={signal}
              emptyText="Waiting for humidity data..."
            />
          )}

          {variant === "gauge" && (
            <GaugeBar
              pct={gaugePct}
              color={isDark ? style.darkColor : style.color}
            />
          )}
          {variant === "tempGauge" && <TemperatureGauge temperature={value} />}
          {variant === "pressure" && (
            <LineTrace
              color={isDark ? style.darkColor : style.color}
              samples={signal}
              sensorType="pressure"
              emptyText="Waiting for pressure data..."
            />
          )}

          {variant === "plain" && <div className="h-[86px]" />}
        </div>

        {/* Normal Range Reference Indicator */}
        {normalRange && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-black/15 dark:border-white/10 bg-white/75 dark:bg-black/30 px-2.5 py-1 backdrop-blur-md">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: "#10b981" }}
            />

            <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              {normalRange}
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        {/* Min / Avg / Peak Summary */}
        <div className="mt-auto">
          <MiniStats items={miniStats} />
        </div>

        {/* Relative Updated Timestamp */}
        {updatedText && (
          <div className="mt-2.5 flex items-center gap-1.5 border-t border-black/15 dark:border-white/10 pt-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono">
            <IoTimeOutline className="text-xs" />
            <span>Last seen {updatedText}</span>
          </div>
        )}
      </div>
    </article>
  );
}
