import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "../theme/theme";

export default function AppHeader({
  title = "Welcome back",
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
      <View style={styles.copy}>
        <Text style={[styles.eyebrow, { color: theme.primary }]}>TRAILGUARD</Text>
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
        <Text style={[styles.icon, { color: theme.text }]}>♧</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 86,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 23,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
  },

  copy: { flex: 1 },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 3,
  },

  notification: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 23,
  },
});
