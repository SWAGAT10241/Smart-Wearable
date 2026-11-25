import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Real React Native vector icon components.
 * Built with native View primitives so they render crisply across iOS and Android without emojis.
 */

export function HeartIcon({ size = 20, color = "#FF4D6D" }) {
  const lobeSize = size * 0.58;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        {/* Left lobe */}
        <View
          style={{
            position: "absolute",
            width: lobeSize,
            height: lobeSize,
            borderRadius: lobeSize / 2,
            backgroundColor: color,
            top: size * 0.1,
            left: size * 0.06,
          }}
        />
        {/* Right lobe */}
        <View
          style={{
            position: "absolute",
            width: lobeSize,
            height: lobeSize,
            borderRadius: lobeSize / 2,
            backgroundColor: color,
            top: size * 0.1,
            right: size * 0.06,
          }}
        />
        {/* Bottom diamond filling point */}
        <View
          style={{
            position: "absolute",
            width: lobeSize * 0.95,
            height: lobeSize * 0.95,
            backgroundColor: color,
            top: size * 0.28,
            transform: [{ rotate: "45deg" }],
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}

export function OxygenIcon({ size = 20, color = "#2563EB" }) {
  const lungWidth = size * 0.32;
  const lungHeight = size * 0.62;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Central trachea */}
      <View
        style={{
          width: 2.5,
          height: size * 0.32,
          backgroundColor: color,
          borderRadius: 1,
          position: "absolute",
          top: size * 0.05,
        }}
      />
      {/* Trachea branch horizontal */}
      <View
        style={{
          width: size * 0.44,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          position: "absolute",
          top: size * 0.32,
        }}
      />
      {/* Left Lung Lobe */}
      <View
        style={{
          position: "absolute",
          left: size * 0.1,
          top: size * 0.28,
          width: lungWidth,
          height: lungHeight,
          borderTopLeftRadius: lungWidth,
          borderBottomLeftRadius: lungWidth * 0.8,
          borderBottomRightRadius: lungWidth * 0.4,
          borderTopRightRadius: 2,
          backgroundColor: color,
          transform: [{ rotate: "-8deg" }],
        }}
      />
      {/* Right Lung Lobe */}
      <View
        style={{
          position: "absolute",
          right: size * 0.1,
          top: size * 0.28,
          width: lungWidth,
          height: lungHeight,
          borderTopRightRadius: lungWidth,
          borderBottomRightRadius: lungWidth * 0.8,
          borderBottomLeftRadius: lungWidth * 0.4,
          borderTopLeftRadius: 2,
          backgroundColor: color,
          transform: [{ rotate: "8deg" }],
        }}
      />
    </View>
  );
}

export function ThermometerIcon({ size = 20, color = "#F59E0B" }) {
  const stemWidth = size * 0.28;
  const stemHeight = size * 0.62;
  const bulbSize = size * 0.48;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Stem Tube */}
      <View
        style={{
          position: "absolute",
          top: size * 0.04,
          width: stemWidth,
          height: stemHeight,
          borderTopLeftRadius: stemWidth / 2,
          borderTopRightRadius: stemWidth / 2,
          borderWidth: 2,
          borderColor: color,
          backgroundColor: "transparent",
          alignItems: "center",
          paddingTop: 3,
        }}
      >
        {/* Inner Mercury Liquid Column */}
        <View
          style={{
            width: stemWidth * 0.5,
            height: stemHeight * 0.65,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
      {/* Bottom Mercury Bulb */}
      <View
        style={{
          position: "absolute",
          bottom: size * 0.04,
          width: bulbSize,
          height: bulbSize,
          borderRadius: bulbSize / 2,
          backgroundColor: color,
          borderWidth: 1.5,
          borderColor: color,
        }}
      />
    </View>
  );
}

export function DropletIcon({ size = 20, color = "#06B6D4" }) {
  const dropSize = size * 0.68;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: dropSize,
          height: dropSize,
          transform: [{ rotate: "45deg" }],
          borderTopLeftRadius: 3,
          borderTopRightRadius: dropSize / 2,
          borderBottomLeftRadius: dropSize / 2,
          borderBottomRightRadius: dropSize / 2,
          backgroundColor: color,
          marginTop: size * 0.08,
        }}
      />
    </View>
  );
}

export function PressureIcon({ size = 20, color = "#8B5CF6" }) {
  const dialSize = size * 0.88;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Circular Barometer Frame */}
      <View
        style={{
          width: dialSize,
          height: dialSize,
          borderRadius: dialSize / 2,
          borderWidth: 2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Gauge Hub */}
        <View
          style={{
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: (size * 0.2) / 2,
            backgroundColor: color,
          }}
        />
        {/* Gauge Indicator Needle pointing up-right */}
        <View
          style={{
            position: "absolute",
            width: 2,
            height: dialSize * 0.38,
            backgroundColor: color,
            top: dialSize * 0.16,
            right: dialSize * 0.32,
            transform: [{ rotate: "35deg" }],
            borderRadius: 1,
          }}
        />
      </View>
    </View>
  );
}

export function BellIcon({ size = 20, color = "#64748B" }) {
  const bellWidth = size * 0.65;
  const bellHeight = size * 0.58;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Bell Top Loop */}
      <View
        style={{
          width: size * 0.18,
          height: size * 0.14,
          borderRadius: size * 0.09,
          borderWidth: 1.8,
          borderColor: color,
          top: size * 0.05,
          position: "absolute",
        }}
      />
      {/* Bell Body Dome */}
      <View
        style={{
          width: bellWidth,
          height: bellHeight,
          borderTopLeftRadius: bellWidth / 2,
          borderTopRightRadius: bellWidth / 2,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          backgroundColor: color,
          top: size * 0.18,
          position: "absolute",
        }}
      />
      {/* Bell Bottom Flared Rim */}
      <View
        style={{
          width: size * 0.85,
          height: 2.5,
          backgroundColor: color,
          borderRadius: 1.5,
          top: size * 0.72,
          position: "absolute",
        }}
      />
      {/* Bell Bottom Clapper */}
      <View
        style={{
          width: size * 0.24,
          height: size * 0.16,
          borderBottomLeftRadius: size * 0.12,
          borderBottomRightRadius: size * 0.12,
          backgroundColor: color,
          top: size * 0.76,
          position: "absolute",
        }}
      />
    </View>
  );
}

export function GearIcon({ size = 20, color = "#64748B" }) {
  const hubSize = size * 0.78;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Gear Outer Ring */}
      <View
        style={{
          width: hubSize,
          height: hubSize,
          borderRadius: hubSize / 2,
          borderWidth: 2.2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Center Hole */}
        <View
          style={{
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: (size * 0.28) / 2,
            backgroundColor: color,
          }}
        />
        {/* Vertical Cogs */}
        <View
          style={{
            position: "absolute",
            width: 3,
            height: size * 0.95,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
        {/* Horizontal Cogs */}
        <View
          style={{
            position: "absolute",
            height: 3,
            width: size * 0.95,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
    </View>
  );
}

export function PinIcon({ size = 20, color = "#0F766E" }) {
  const headSize = size * 0.62;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Pin Circular Head */}
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          borderWidth: 2.2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}
      >
        {/* Center Aperture Dot */}
        <View
          style={{
            width: headSize * 0.32,
            height: headSize * 0.32,
            borderRadius: (headSize * 0.32) / 2,
            backgroundColor: color,
          }}
        />
      </View>
      {/* Triangle Point Tip */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.18,
          borderRightWidth: size * 0.18,
          borderTopWidth: size * 0.26,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: color,
          marginTop: -2,
        }}
      />
    </View>
  );
}

export function MountainIcon({ size = 20, color = "#0D9488" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Primary Left Mountain Peak */}
      <View
        style={{
          position: "absolute",
          left: size * 0.05,
          bottom: size * 0.1,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.34,
          borderRightWidth: size * 0.34,
          borderBottomWidth: size * 0.65,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
        }}
      />
      {/* Secondary Right Mountain Peak */}
      <View
        style={{
          position: "absolute",
          right: size * 0.06,
          bottom: size * 0.1,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.28,
          borderRightWidth: size * 0.28,
          borderBottomWidth: size * 0.48,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
          opacity: 0.8,
        }}
      />
    </View>
  );
}

export function WarningIcon({ size = 20, color = "#DC2626" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Warning Triangle Shape */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.48,
          borderRightWidth: size * 0.48,
          borderBottomWidth: size * 0.82,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
          borderRadius: 2,
        }}
      />
      {/* Exclamation Bar */}
      <View
        style={{
          position: "absolute",
          top: size * 0.38,
          width: 2.2,
          height: size * 0.24,
          backgroundColor: "#FFFFFF",
          borderRadius: 1,
        }}
      />
      {/* Exclamation Dot */}
      <View
        style={{
          position: "absolute",
          bottom: size * 0.15,
          width: 2.2,
          height: 2.2,
          backgroundColor: "#FFFFFF",
          borderRadius: 1.1,
        }}
      />
    </View>
  );
}

export function CheckIcon({ size = 20, color = "#16A34A" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.75,
          height: size * 0.45,
          borderLeftWidth: 2.5,
          borderBottomWidth: 2.5,
          borderColor: color,
          transform: [{ rotate: "-45deg" }],
          marginTop: -size * 0.12,
        }}
      />
    </View>
  );
}

export function FireIcon({ size = 20, color = "#EA580C" }) {
  const flameW = size * 0.58;
  const flameH = size * 0.78;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: flameW,
          height: flameH,
          borderTopLeftRadius: flameW * 0.9,
          borderTopRightRadius: flameW * 0.2,
          borderBottomLeftRadius: flameW / 2,
          borderBottomRightRadius: flameW / 2,
          backgroundColor: color,
          transform: [{ rotate: "-10deg" }],
        }}
      />
    </View>
  );
}

export function WatchIcon({ size = 20, color = "#0F766E" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Watch Top Strap */}
      <View
        style={{
          width: size * 0.38,
          height: size * 0.2,
          backgroundColor: color,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          position: "absolute",
          top: 0,
        }}
      />
      {/* Watch Dial */}
      <View
        style={{
          width: size * 0.72,
          height: size * 0.72,
          borderRadius: (size * 0.72) / 2,
          borderWidth: 2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: (size * 0.22) / 2,
            backgroundColor: color,
          }}
        />
      </View>
      {/* Watch Bottom Strap */}
      <View
        style={{
          width: size * 0.38,
          height: size * 0.2,
          backgroundColor: color,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
}

export function BootIcon({ size = 20, color = "#2DD4BF" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Boot Ankle Shaft */}
      <View
        style={{
          width: size * 0.42,
          height: size * 0.55,
          backgroundColor: color,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          position: "absolute",
          top: size * 0.08,
          left: size * 0.18,
        }}
      />
      {/* Boot Foot & Toe */}
      <View
        style={{
          width: size * 0.74,
          height: size * 0.35,
          backgroundColor: color,
          borderRadius: size * 0.12,
          position: "absolute",
          bottom: size * 0.12,
          left: size * 0.12,
        }}
      />
    </View>
  );
}

export function UserIcon({ size = 20, color = "#64748B" }) {
  const headSize = size * 0.44;
  const bodyWidth = size * 0.82;
  const bodyHeight = size * 0.4;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* User Circular Head */}
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          backgroundColor: color,
          position: "absolute",
          top: size * 0.06,
        }}
      />
      {/* User Torso / Shoulders */}
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderTopLeftRadius: bodyWidth / 2,
          borderTopRightRadius: bodyWidth / 2,
          backgroundColor: color,
          position: "absolute",
          bottom: size * 0.04,
        }}
      />
    </View>
  );
}

export function ClockIcon({ size = 20, color = "#3B82F6" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.84,
          height: size * 0.84,
          borderRadius: (size * 0.84) / 2,
          borderWidth: 2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 2.2,
            height: size * 0.28,
            backgroundColor: color,
            position: "absolute",
            top: size * 0.12,
            borderRadius: 1,
          }}
        />
        <View
          style={{
            height: 2.2,
            width: size * 0.24,
            backgroundColor: color,
            position: "absolute",
            right: size * 0.14,
            borderRadius: 1,
          }}
        />
      </View>
    </View>
  );
}

export function ShieldIcon({ size = 20, color = "#2DD4BF" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.76,
          height: size * 0.86,
          borderWidth: 2,
          borderColor: color,
          borderTopLeftRadius: size * 0.2,
          borderTopRightRadius: size * 0.2,
          borderBottomLeftRadius: size * 0.38,
          borderBottomRightRadius: size * 0.38,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size * 0.24,
            height: size * 0.34,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}

export function EyeIcon({ size = 20, color = "#94A3B8" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.9,
          height: size * 0.52,
          borderWidth: 1.8,
          borderColor: color,
          borderRadius: size * 0.26,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size * 0.24,
            height: size * 0.24,
            borderRadius: (size * 0.24) / 2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

export function EyeOffIcon({ size = 20, color = "#94A3B8" }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.9,
          height: size * 0.52,
          borderWidth: 1.8,
          borderColor: color,
          borderRadius: size * 0.26,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: (size * 0.2) / 2,
            backgroundColor: color,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          width: 2,
          height: size * 0.75,
          backgroundColor: color,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
}

export function BatteryIcon({ size = 16, color = "#22C55E", level = 88 }) {
  const width = size * 1.35;
  const height = size * 0.72;
  return (
    <View style={[styles.center, { flexDirection: "row", alignItems: "center" }]}>
      <View
        style={{
          width,
          height,
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 4,
          padding: 1.5,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(10, level))}%`,
            backgroundColor: color,
            borderRadius: 1.5,
          }}
        />
      </View>
      <View
        style={{
          width: 2,
          height: height * 0.45,
          backgroundColor: color,
          borderTopRightRadius: 1,
          borderBottomRightRadius: 1,
          marginLeft: 1.5,
        }}
      />
    </View>
  );
}

export function PulseWave({ color = "#F43F5E", height = 22 }) {
  const barHeights = [4, 5, 4, 7, 4, 16, 6, 20, 11, 5, 4, 9, 4, 5, 4, 4];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height,
        width: "100%",
        paddingHorizontal: 4,
      }}
    >
      {barHeights.map((h, i) => (
        <View
          key={i}
          style={{
            width: 3.5,
            height: h,
            backgroundColor: color,
            borderRadius: 1.75,
            opacity: i === 7 || i === 5 ? 0.95 : 0.45,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
