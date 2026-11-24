import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. User's manual selection in localStorage takes top priority
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    // 2. If no saved choice, automatically match user's OS / device theme
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    // 3. Safe fallback
    return "dark";
  });
  useEffect(() => {
    const root = document.documentElement;
    // Remove previous theme
    root.classList.remove("light", "dark");
    // Add current theme
    root.classList.add(theme);
    // Save preference
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };
  const setLightTheme = () => {
    setTheme("light");
  };
  const setDarkTheme = () => {
    setTheme("dark");
  };
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode: theme,
        setTheme,
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}
