// src/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // ✅ initialize theme from localStorage (not default "light")
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // ✅ Apply theme to <html> instantly when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  // 🎨 gradient backgrounds per theme
  const background =
    theme === "light"
      ? "linear-gradient(120deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)"
      : "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        style={{
          minHeight: "100vh",
          background,
          color: theme === "light" ? "#0f172a" : "#f8fafc",
          transition: "background 0.45s ease, color 0.45s ease",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
