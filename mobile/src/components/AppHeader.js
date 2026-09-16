import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "../theme/theme";

export default function AppHeader({
  title = "TrailGuard",
  subtitle,
  onNotification,
}) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            {subtitle}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={onNotification}
        style={[styles.notification, { backgroundColor: theme.background }]}
      >
        <Text style={styles.icon}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
  },

  notification: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 20,
  },
});
