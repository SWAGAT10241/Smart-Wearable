import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "../theme/theme";

const tabs = [
  {
    name: "Dashboard",
    label: "Home",
    icon: "⌂",
  },
  {
    name: "LiveMap",
    label: "Map",
    icon: "⌖",
  },
  {
    name: "History",
    label: "History",
    icon: "◷",
  },
  {
    name: "Alerts",
    label: "Alerts",
    icon: "⚠",
  },
  {
    name: "Settings",
    label: "Settings",
    icon: "⚙",
  },
];

export default function BottomTabBar({ state, navigation }) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      ]}
    >
      {tabs.map((tab, index) => {
        const focused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Text
              style={{
                fontSize: 21,
                color: focused ? theme.primary : theme.secondaryText,
              }}
            >
              {tab.icon}
            </Text>

            <Text
              style={[
                styles.label,
                {
                  color: focused ? theme.primary : theme.secondaryText,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 5,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
  },
});
