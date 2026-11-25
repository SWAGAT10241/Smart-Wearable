import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/theme";
import TabIcon from "./TabIcon";

const tabs = [
  {
    name: "Dashboard",
    label: "Home",
  },
  {
    name: "LiveMap",
    label: "Map",
  },
  {
    name: "History",
    label: "History",
  },
];

export default function BottomTabBar({ state, navigation }) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          paddingBottom: bottomPadding,
          height: 56 + bottomPadding,
        },
      ]}
    >
      {tabs.map((tab, index) => {
        const focused = state.index === index;
        const color = focused ? theme.primary : theme.secondaryText;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(tab.name)}
          >
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor: theme.primaryLight,
                },
              ]}
            >
              <TabIcon
                name={tab.name}
                focused={focused}
                color={color}
                size={20}
              />
            </View>

            <Text
              style={[
                styles.label,
                {
                  color,
                  fontWeight: focused ? "700" : "500",
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
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 6,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  iconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
});
