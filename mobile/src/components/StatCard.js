import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme/theme";

import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme/theme";

/**
 * World-class biometric and environmental telemetry card.
 * Incorporates Garmin & Apple Health design patterns:
 * - Distinct category color accents & icon badges
 * - Target safe-range indicator & baseline status
 * - Subtle range progress track
 */
export default function StatCard({
  title,
  value,
  unit,
  icon,
  iconBg,
  status,
  subtitle,
  tag,
  tagColor,
  barPercent,
  barColor,
  style: customStyle,
}) {
  const theme = useAppTheme();

  const statusColor =
    status === "danger"
      ? theme.danger
      : status === "warning"
        ? theme.warning
        : status === "success"
          ? theme.success
          : theme.primary;

  const resolvedIconBg = iconBg || theme.primaryLight;
  const resolvedBarColor = barColor || statusColor;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        customStyle,
      ]}
    >
      <View style={styles.top}>
        <View style={[styles.iconBox, { backgroundColor: resolvedIconBg }]}>
          {React.isValidElement(icon) ? (
            icon
          ) : (
            <Text style={styles.icon}>{icon}</Text>
          )}
        </View>

        {tag ? (
          <View
            style={[
              styles.tagPill,
              {
                backgroundColor: tagColor
                  ? `${tagColor}1A`
                  : `${statusColor}1A`,
                borderColor: tagColor || statusColor,
              },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                { color: tagColor || statusColor },
              ]}
            >
              {tag}
            </Text>
          </View>
        ) : (
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
        )}
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

      {/* Target range & baseline tag (Apple Health & Garmin style) */}
      {subtitle ? (
        <Text
          style={[styles.subtitle, { color: theme.secondaryText }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      ) : null}

      {/* Subtle range gauge track if barPercent provided */}
      {typeof barPercent === "number" && (
        <View
          style={[
            styles.gaugeTrack,
            { backgroundColor: `${theme.border}80` },
          ]}
        >
          <View
            style={[
              styles.gaugeFill,
              {
                width: `${Math.min(100, Math.max(0, barPercent))}%`,
                backgroundColor: resolvedBarColor,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
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

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
  },

  tagText: {
    fontSize: 9.5,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    textTransform: "uppercase",
  },

  title: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    marginBottom: 4,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },

  unit: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    marginLeft: 4,
  },

  subtitle: {
    fontSize: 10.5,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    marginTop: 4,
  },

  gaugeTrack: {
    height: 3.5,
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },

  gaugeFill: {
    height: "100%",
    borderRadius: 2,
  },
});
