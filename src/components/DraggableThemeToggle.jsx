import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../ThemeContext";

const DraggableThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  // load previous button position (if saved)
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("themeBtnPos");
    return saved ? JSON.parse(saved) : { x: 20, y: 20 }; // default top-left
  });

  // save position when moved
  const handleDragEnd = (event, info) => {
    const newPos = { x: info.point.x, y: info.point.y };
    setPosition(newPos);
    localStorage.setItem("themeBtnPos", JSON.stringify(newPos));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 999,
        background:
          theme === "light"
            ? "linear-gradient(135deg,#e0f2fe,#bae6fd)"
            : "linear-gradient(135deg,#1e293b,#334155)",
        color: theme === "light" ? "#0f172a" : "#f8fafc",
        borderRadius: "50%",
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        cursor: "grab",
        border: "1px solid rgba(255,255,255,0.2)",
        userSelect: "none",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95, cursor: "grabbing" }}
      title="Drag me!"
    >
      {theme === "light" ? (
        <Moon size={24} onClick={toggleTheme} style={{ cursor: "pointer" }} />
      ) : (
        <Sun size={24} onClick={toggleTheme} style={{ cursor: "pointer" }} />
      )}
    </motion.div>
  );
};

export default DraggableThemeToggle;
