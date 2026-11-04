import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme/theme";
import { WatchIcon, BatteryIcon } from "./Icons";

export default function DeviceCard({ device }) {
  const theme = useAppTheme();

  if (!device) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          No TrailGuard device paired
        </Text>

        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Go to Settings to pair your wearable.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.deviceIcon,
            { backgroundColor: `${theme.primary}1A` },
          ]}
        >
          <WatchIcon size={22} color={theme.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={[styles.title, { color: theme.text }]}>
              {device.deviceName || "TrailGuard Wearable"}
            </Text>
            <View style={styles.onlineDot} />
          </View>

          <Text style={[styles.id, { color: theme.secondaryText }]}>
            {device.deviceId || "ESP32-S3"} · BLE 5.0
          </Text>
        </View>

        <View
          style={[
            styles.status,
            {
              backgroundColor:
                device.status === "active"
                  ? `${theme.success}1A`
                  : theme.background,
              borderColor:
                device.status === "active" ? theme.success : theme.border,
            },
          ]}
        >
          <Text
            style={{
              color:
                device.status === "active"
                  ? theme.success
                  : theme.secondaryText,
              fontSize: 10,
              fontWeight: "700",
              fontFamily: Platform.select({
                ios: "System",
                android: "sans-serif-medium",
              }),
            }}
          >
            {device.status === "active" ? "ARMED" : "INACTIVE"}
          </Text>
        </View>
      </View>

      {/* Garmin-style hardware telemetry strip */}
      <View
        style={[
          styles.telemetryStrip,
          {
            backgroundColor: `${theme.background}80`,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.telemetryItem}>
          <BatteryIcon size={13} color={theme.success} level={88} />
          <Text style={[styles.telemetryText, { color: theme.text }]}>
            88% · ~3.5d
          </Text>
        </View>

        <View style={styles.dividerDot} />

        <View style={styles.telemetryItem}>
          <View style={styles.signalBars}>
            <View style={[styles.signalBar, { height: 4, backgroundColor: theme.primary }]} />
            <View style={[styles.signalBar, { height: 7, backgroundColor: theme.primary }]} />
            <View style={[styles.signalBar, { height: 10, backgroundColor: theme.primary }]} />
            <View style={[styles.signalBar, { height: 13, backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.telemetryText, { color: theme.secondaryText }]}>
            -52 dBm
          </Text>
        </View>

        <View style={styles.dividerDot} />

        <View style={styles.telemetryItem}>
          <Text style={[styles.telemetryText, { color: theme.secondaryText }]}>
            Sync: Just now
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 23,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },

  id: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#22C55E",
  },

  telemetryStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 0.5,
  },

  telemetryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  telemetryText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },

  dividerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#64748B",
  },

  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 1.5,
    height: 13,
  },

  signalBar: {
    width: 2.5,
    borderRadius: 1,
  },
});
