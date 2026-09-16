import { useColorScheme } from "react-native";

export const lightTheme = {
  background: "#F5F7FA",
  card: "#FFFFFF",
  text: "#111827",
  secondaryText: "#6B7280",
  border: "#E5E7EB",
  primary: "#0F766E",
  primaryLight: "#CCFBF1",
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
  blue: "#2563EB",
  purple: "#7C3AED",
};

export const darkTheme = {
  background: "#07111F",
  card: "#0D1B2A",
  text: "#F8FAFC",
  secondaryText: "#94A3B8",
  border: "#1E293B",
  primary: "#2DD4BF",
  primaryLight: "#134E4A",
  success: "#4ADE80",
  danger: "#F87171",
  warning: "#FBBF24",
  blue: "#60A5FA",
  purple: "#A78BFA",
};

export function useAppTheme() {
  const scheme = useColorScheme();

  return scheme === "dark" ? darkTheme : lightTheme;
}
