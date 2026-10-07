import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../theme/theme";

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
          <Text style={styles.icon}>⌚</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text }]}>
            {device.deviceName || "TrailGuard Wearable"}
          </Text>

          <Text style={[styles.id, { color: theme.secondaryText }]}>
            {device.deviceId}
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
              fontSize: 11,
              fontWeight: "700",
            }}
          >
            {device.status === "active" ? "ACTIVE" : "INACTIVE"}
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
    fontWeight: "800",
  },

  id: {
    marginTop: 3,
    fontSize: 11,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
  },

  status: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },
});
