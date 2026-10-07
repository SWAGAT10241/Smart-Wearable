import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "../theme/theme";

export default function ActivityCard({
  distance = 0,
  duration = 0,
  elevation = 0,
  calories = 0,
}) {
  const theme = useAppTheme();

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
      <Text
        style={[
          styles.title,
          { color: theme.text },
        ]}
      >
        Today's Activity
      </Text>

      <View style={styles.grid}>
        <Item
          icon="🥾"
          label="Distance"
          value={`${distance} km`}
          theme={theme}
        />

        <Item
          icon="⏱️"
          label="Duration"
          value={duration}
          theme={theme}
        />

        <Item
          icon="⛰️"
          label="Elevation"
          value={`${elevation} m`}
          theme={theme}
        />

        <Item
          icon="🔥"
          label="Calories"
          value={`${calories} kcal`}
          theme={theme}
        />
      </View>
    </View>
  );
}

function Item({
  icon,
  label,
  value,
  theme,
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.icon}>
        {icon}
      </Text>

      <Text
        style={[
          styles.label,
          { color: theme.secondaryText },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.value,
          { color: theme.text },
        ]}
      >
        {value}
      </Text>
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

  title: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  item: {
    width: "50%",
    paddingVertical: 10,
  },

  icon: {
    fontSize: 20,
    marginBottom: 5,
  },

  label: {
    fontSize: 11,
  },

  value: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },
});
