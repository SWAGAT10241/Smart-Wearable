import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "../theme/theme";
import { BellIcon } from "./Icons";

export default function AppHeader({
  title = "TrailGuard",
  subtitle,
  badgeCount = 0,
  onNotification,
  onProfile,
  user,
}) {
  const theme = useAppTheme();
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "R";

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
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onNotification}
          style={[
            styles.notificationBtn,
            { backgroundColor: theme.background, borderColor: theme.border },
          ]}
          activeOpacity={0.7}
        >
          <BellIcon size={18} color={theme.text} />
          {badgeCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.danger || "#EF4444" }]}>
              <Text style={styles.badgeText}>
                {badgeCount > 9 ? "9+" : badgeCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {onProfile && (
          <TouchableOpacity
            onPress={onProfile}
            style={[
              styles.avatarBtn,
              {
                backgroundColor: `${theme.primary}1A`,
                borderColor: theme.primary,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {userInitial}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },

  copy: { flex: 1 },

  title: {
    fontSize: 21,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },

  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },

  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
});
