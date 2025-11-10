// src/pages/RoomSelect.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

function RoomSelect() {
  const [room, setRoom] = useState("");
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleJoin = (type) => {
    if (!room.trim()) {
      alert("Please enter a room name!");
      return;
    }
    navigate(`/chat/${room.trim()}`);
  };

  // 🎨 colors & shadows
  const background =
    theme === "light"
      ? "linear-gradient(120deg,#f0f9ff 0%,#e0f2fe 50%,#ede9fe 100%)"
      : "radial-gradient(circle at top left, #020617, #0f172a 40%, #1e3a8a 100%)"; // ✨ deep glowing dark mode

  const cardBackground =
    theme === "light"
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(30, 41, 59, 0.75)";
  const cardBorder =
    theme === "light"
      ? "1px solid rgba(226,232,240,0.6)"
      : "1px solid rgba(96,165,250,0.25)";
  const titleColor = theme === "light" ? "#2563eb" : "#93c5fd";

  return (
    <div
      style={{
        minHeight: "100vh",
        background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        transition: "all 0.4s ease",
        padding: "0 12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ✨ Ambient blue glow (dark mode only) */}
      {theme === "dark" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.2 }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.3), transparent 60%)",
            zIndex: 0,
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: 360,
          background: cardBackground,
          border: cardBorder,
          borderRadius: 20,
          padding: "40px 20px",
          boxShadow:
            theme === "light"
              ? "0 10px 25px rgba(0,0,0,0.1)"
              : "0 12px 45px rgba(59,130,246,0.35)", // 💙 glowing shadow in dark mode
          backdropFilter: theme === "dark" ? "blur(16px)" : "none",
          textAlign: "center",
          color: theme === "light" ? "#0f172a" : "#f8fafc",
          position: "relative",
          zIndex: 2,
          transition: "all 0.4s ease",
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: "26px",
            color: titleColor,
            marginBottom: "25px",
            textShadow:
              theme === "dark"
                ? "0 0 10px rgba(96,165,250,0.4)"
                : "none",
          }}
        >
          Private Rooms 💬
        </h2>

        {/* ✅ Input wrapper */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "320px",
              padding: "12px 14px",
              borderRadius: "12px",
              border:
                theme === "light"
                  ? "1.5px solid #e2e8f0"
                  : "1.5px solid rgba(148,163,184,0.4)",
              outline: "none",
              background:
                theme === "light"
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(15,23,42,0.7)",
              color: theme === "light" ? "#0f172a" : "#f8fafc",
              fontSize: "15px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleJoin("create")}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #38bdf8, #2563eb)",
            color: "white",
            fontWeight: 600,
            border: "none",
            borderRadius: "12px",
            padding: "12px",
            cursor: "pointer",
            marginBottom: "10px",
            boxShadow:
              theme === "dark"
                ? "0 0 10px rgba(37,99,235,0.3)"
                : "none",
            transition: "all 0.3s ease",
          }}
        >
          Create Room 🚀
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleJoin("join")}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            color: "white",
            fontWeight: 600,
            border: "none",
            borderRadius: "12px",
            padding: "12px",
            cursor: "pointer",
            boxShadow:
              theme === "dark"
                ? "0 0 10px rgba(37,99,235,0.3)"
                : "none",
          }}
        >
          Join Room 🔑
        </motion.button>
      </motion.div>
    </div>
  );
}

export default RoomSelect;
