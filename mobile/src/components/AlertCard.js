import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "../theme/theme";

export default function AlertCard({ alert }) {
  const theme = useAppTheme();

  const isFall =
    alert?.type === "fall" ||
    alert?.eventType === "fall";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isFall
            ? theme.danger
            : theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor: isFall
              ? "#FEE2E2"
              : theme.primaryLight,
          },
        ]}
      >
        <Text style={styles.iconText}>
          {isFall ? "⚠️" : "🔔"}
        </Text>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: theme.text },
          ]}
        >
          {isFall
            ? "Fall Detected"
            : "TrailGuard Alert"}
        </Text>

        <Text
          style={[
            styles.message,
            { color: theme.secondaryText },
          ]}
        >
          {alert?.message ||
            alert?.description ||
            "Safety event detected."}
        </Text>

        {alert?.timestamp && (
          <Text
            style={[
              styles.time,
              { color: theme.secondaryText },
            ]}
          >
            {new Date(
              alert.timestamp,
            ).toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  iconText: {
    fontSize: 18,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
  },

  message: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },

  time: {
    fontSize: 10,
    marginTop: 5,
  },
});
