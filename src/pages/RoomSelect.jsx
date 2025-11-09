// src/pages/RoomSelect.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function RoomSelect() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleJoin = (type) => {
    if (!room.trim()) {
      alert("Please enter a room name!");
      return;
    }
    navigate(`/chat/${room.trim()}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff, #e0f2fe, #ede9fe)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px 50px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          textAlign: "center",
          width: "380px",
        }}
      >
        <h2
          style={{
            fontWeight: "700",
            fontSize: "26px",
            background: "linear-gradient(90deg, #2563eb, #06b6d4)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "20px",
          }}
        >
          Private Rooms 💬
        </h2>

        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1.5px solid #e2e8f0",
            outline: "none",
            fontSize: "15px",
            marginBottom: "20px",
          }}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleJoin("create")}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #38bdf8, #2563eb)",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: "12px",
            padding: "12px",
            cursor: "pointer",
            marginBottom: "10px",
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
            fontWeight: "600",
            border: "none",
            borderRadius: "12px",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          Join Room 🔑
        </motion.button>
      </motion.div>
    </div>
  );
}

export default RoomSelect;
