import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9, rotate: 10 }}
      onClick={toggleTheme}
      style={{
        background: theme === "light" ? "#e2e8f0" : "#475569",
        color: theme === "light" ? "#0f172a" : "#f8fafc",
        border: "none",
        borderRadius: "50%",
        width: 42,
        height: 42,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
      title="Toggle Theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
}
