import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    // Default to dark theme for mission control
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
