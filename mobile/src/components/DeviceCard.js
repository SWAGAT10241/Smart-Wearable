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
          style={[styles.deviceIcon, { backgroundColor: theme.primaryLight }]}
        >
          <WatchIcon size={20} color={theme.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text }]}>
            {device.deviceName || "TrailGuard Wearable"}
          </Text>

          <Text style={[styles.id, { color: theme.secondaryText }]}>
            {device.deviceId} · BLE Connected
          </Text>
        </View>

        <View style={styles.rightActions}>
          <View
            style={[
              styles.batteryPill,
              { backgroundColor: theme.background, borderColor: theme.border },
            ]}
          >
            <BatteryIcon size={12} color={theme.success} level={88} />
            <Text style={[styles.batteryText, { color: theme.success }]}>
              88%
            </Text>
          </View>

          <View
            style={[
              styles.status,
              {
                backgroundColor:
                  device.status === "active"
                    ? theme.primaryLight
                    : theme.background,
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
                fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
              }}
            >
              {device.status === "active" ? "ACTIVE" : "INACTIVE"}
            </Text>
          </View>
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
  },

  rightActions: {
    alignItems: "flex-end",
    gap: 6,
  },

  batteryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
  },

  batteryText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
});
