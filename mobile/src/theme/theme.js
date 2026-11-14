import { useColorScheme } from "react-native";

export const lightTheme = {
  background: "#F4F9FA",
  card: "#FFFFFF",
  text: "#172033",
  secondaryText: "#5C7086",
  mutedText: "#8FA0B0",
  border: "#D9E4E8",
  primary: "#0E9C8C",
  primaryLight: "#E7F5F4",
  success: "#14B8A6",
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
