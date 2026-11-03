import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../theme/theme";

export default function StatCard({ title, value, unit, icon, status }) {
  const theme = useAppTheme();

  const statusColor =
    status === "danger"
      ? theme.danger
      : status === "warning"
        ? theme.warning
        : status === "success"
          ? theme.success
          : theme.primary;

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
      <View style={styles.top}>
        <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <View style={[styles.status, { backgroundColor: `${statusColor}20` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status === "danger" ? "Check" : "Normal"}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.secondaryText }]}>
        {title}
      </Text>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: theme.text }]}>
          {value ?? "--"}
        </Text>

        {unit && (
          <Text style={[styles.unit, { color: theme.secondaryText }]}>
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    minHeight: 158,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 19,
  },

  status: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  title: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.45,
    marginBottom: 5,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  value: {
    fontSize: 28,
    fontWeight: "800",
  },

  unit: {
    fontSize: 11,
    marginLeft: 4,
  },
});
