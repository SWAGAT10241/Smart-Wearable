import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Pure React Native vector-style Tab Icons.
 * Renders without external vector-icon dependencies so it works out-of-the-box on iOS & Android.
 */
export default function TabIcon({ name, focused, color, size = 20 }) {
  switch (name) {
    case "Dashboard":
      return <HomeIcon color={color} size={size} focused={focused} />;
    case "LiveMap":
      return <MapIcon color={color} size={size} focused={focused} />;
    case "History":
      return <HistoryIcon color={color} size={size} focused={focused} />;
    case "Alerts":
      return <AlertIcon color={color} size={size} focused={focused} />;
    case "Settings":
      return <SettingsIcon color={color} size={size} focused={focused} />;
    default:
      return null;
  }
}

function HomeIcon({ color, size, focused }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Roof */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.45,
          borderRightWidth: size * 0.45,
          borderBottomWidth: size * 0.38,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
        }}
      />
      {/* House Body */}
      <View
        style={{
          width: size * 0.65,
          height: size * 0.42,
          backgroundColor: focused ? color : "transparent",
          borderWidth: 1.8,
          borderColor: color,
          borderTopWidth: 0,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* Door */}
        <View
          style={{
            width: size * 0.22,
            height: size * 0.24,
            backgroundColor: focused ? "#0D1B2A" : color,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
      </View>
    </View>
  );
}

function MapIcon({ color, size, focused }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Outer Pin Circle */}
      <View
        style={{
          width: size * 0.65,
          height: size * 0.65,
          borderRadius: (size * 0.65) / 2,
          borderWidth: 2,
          borderColor: color,
          backgroundColor: focused ? color : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pin Center Dot */}
        <View
          style={{
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: (size * 0.22) / 2,
            backgroundColor: focused ? "#0D1B2A" : color,
          }}
        />
      </View>
      {/* Pin Pointer Tip */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.18,
          borderRightWidth: size * 0.18,
          borderTopWidth: size * 0.25,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: color,
          marginTop: -1,
        }}
      />
    </View>
  );
}

function HistoryIcon({ color, size }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Clock Face Circle */}
      <View
        style={{
          width: size * 0.82,
          height: size * 0.82,
          borderRadius: (size * 0.82) / 2,
          borderWidth: 2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Center Pivot */}
        <View
          style={{
            width: 2.5,
            height: 2.5,
            borderRadius: 1.25,
            backgroundColor: color,
            position: "absolute",
          }}
        />
        {/* Hour Hand (points up) */}
        <View
          style={{
            width: 2,
            height: size * 0.28,
            backgroundColor: color,
            position: "absolute",
            top: size * 0.12,
            borderRadius: 1,
          }}
        />
        {/* Minute Hand (points right) */}
        <View
          style={{
            height: 2,
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

function AlertIcon({ color, size, focused }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Warning Triangle */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.44,
          borderRightWidth: size * 0.44,
          borderBottomWidth: size * 0.76,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      />
      {/* Exclamation Bar inside Triangle */}
      <View
        style={{
          position: "absolute",
          top: size * 0.35,
          width: 2,
          height: size * 0.24,
          backgroundColor: focused ? "#0D1B2A" : "#FFFFFF",
          borderRadius: 1,
        }}
      />
      {/* Exclamation Dot */}
      <View
        style={{
          position: "absolute",
          bottom: size * 0.16,
          width: 2,
          height: 2,
          backgroundColor: focused ? "#0D1B2A" : "#FFFFFF",
          borderRadius: 1,
        }}
      />
    </View>
  );
}

function SettingsIcon({ color, size }) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Outer Gear Ring */}
      <View
        style={{
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: (size * 0.8) / 2,
          borderWidth: 2.2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Inner Hub */}
        <View
          style={{
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: (size * 0.3) / 2,
            backgroundColor: color,
          }}
        />
        {/* Gear Cogs / Teeth */}
        <View
          style={{
            position: "absolute",
            width: 3,
            height: size * 0.95,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
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

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
