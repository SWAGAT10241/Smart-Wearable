import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../theme/theme";
import { BellIcon, GearIcon, UserIcon } from "./Icons";

export default function AppHeader({
  title = "TrailGuard",
  subtitle,
  onNotification,
  onSettings,
  onProfile,
  user,
  showBack = false,
  onBack,
  badgeCount = 0,
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
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.backButton, { backgroundColor: theme.background }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
        )}

        <View>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {onNotification && (
          <TouchableOpacity
            onPress={onNotification}
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            activeOpacity={0.7}
          >
            <BellIcon size={18} color={theme.text} />
            {badgeCount > 0 && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.danger || "#EF4444" },
                ]}
              >
                <Text style={styles.badgeText}>
                  {badgeCount > 9 ? "9+" : badgeCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {onProfile && (
          <TouchableOpacity
            onPress={onProfile}
            style={[
              styles.avatarButton,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.border,
              },
            ]}
            activeOpacity={0.7}
          >
            {user?.username ? (
              <Text style={[styles.avatarInitial, { color: theme.primary }]}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <UserIcon size={18} color={theme.primary} />
            )}
          </TouchableOpacity>
        )}

        {onSettings && !onProfile && (
          <TouchableOpacity
            onPress={onSettings}
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            activeOpacity={0.7}
          >
            <GearIcon size={18} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>
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

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    fontSize: 20,
    fontWeight: "700",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  icon: {
    fontSize: 18,
  },

  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },

  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
});
