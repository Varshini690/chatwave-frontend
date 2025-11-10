// src/pages/Register.jsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../ThemeContext";
import ThemeToggle from "../components/ThemeToggle"; // ✅ Theme toggle button

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  // Input handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/register", form, {
      headers: { "Content-Type": "application/json" },
    });
    setMessage(res.data.message || "Registered successfully!");
    alert("🎉 Registration successful! Please log in.");
    navigate("/login");
  } catch (err) {
    console.error("❌ Registration error:", err);
    setMessage(err.response?.data?.error || "Error registering");
  }
};


  // Tilt animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xVal = (event.clientX - rect.left) / rect.width;
    const yVal = (event.clientY - rect.top) / rect.height;
    x.set(xVal);
    y.set(yVal);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // 🌗 Theme-based colors
  const background =
    theme === "light"
      ? "linear-gradient(120deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)"
      : "radial-gradient(circle at top left, #020617, #0f172a 40%, #1e3a8a 100%)"; // ✨ updated deep glowing gradient

  const cardBackground =
    theme === "light"
      ? "rgba(255, 255, 255, 0.85)"
      : "rgba(30, 41, 59, 0.8)";

  const textColor = theme === "light" ? "#0f172a" : "#f8fafc";
  const labelColor = theme === "light" ? "#334155" : "#cbd5e1";
  const borderColor =
    theme === "light" ? "#e2e8f0" : "rgba(148,163,184,0.4)";
  const inputBg =
    theme === "light"
      ? "rgba(255,255,255,0.95)"
      : "rgba(15,23,42,0.7)";

  return (
    <div
      style={{
        minHeight: "100vh",
        background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
        transition: "all 0.4s ease-in-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ✨ Ambient glow for dark mode */}
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

      <ThemeToggle />

      {/* 🌈 3D Card Container */}
      <motion.div
        style={{
          perspective: 1000,
          width: "100%",
          maxWidth: "420px",
          zIndex: 2,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            background: cardBackground,
            backdropFilter: "blur(25px)",
            borderRadius: "24px",
            padding: "40px 30px",
            boxShadow:
              theme === "light"
                ? "0 10px 40px rgba(0,0,0,0.1)"
                : "0 12px 45px rgba(59,130,246,0.35)", // ✨ more vivid dark glow
            transition: "transform 0.3s ease",
            color: textColor,
          }}
        >
          {/* ✨ Fixed Gradient Title */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "35px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <motion.h2
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                fontWeight: "700",
                fontSize: "clamp(22px, 4vw, 28px)",
                backgroundImage:
                  theme === "light"
                    ? "linear-gradient(90deg, #2563eb, #06b6d4)"
                    : "linear-gradient(90deg, #93c5fd, #38bdf8)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100%",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow:
                  theme === "dark"
                    ? "0 0 10px rgba(96,165,250,0.4)"
                    : "0 0 5px rgba(37,99,235,0.15)",
                letterSpacing: "0.5px",
                userSelect: "none",
                willChange: "transform, opacity",
              }}
            >
              Create Your Account 🌊
            </motion.h2>
          </div>

          {/* 🧾 Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Username */}
            <div style={{ marginBottom: "22px", marginRight: "18px" }}>
              <label
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: labelColor,
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Username
              </label>
              <motion.input
                whileFocus={{
                  boxShadow: "0 0 10px rgba(37,99,235,0.2)",
                  borderColor: "#38bdf8",
                }}
                transition={{ type: "spring", stiffness: 250 }}
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${borderColor}`,
                  outline: "none",
                  fontSize: "15px",
                  background: inputBg,
                  color: textColor,
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "22px", marginRight: "18px" }}>
              <label
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: labelColor,
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Email
              </label>
              <motion.input
                whileFocus={{
                  boxShadow: "0 0 10px rgba(37,99,235,0.2)",
                  borderColor: "#38bdf8",
                }}
                transition={{ type: "spring", stiffness: 250 }}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${borderColor}`,
                  outline: "none",
                  fontSize: "15px",
                  background: inputBg,
                  color: textColor,
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "22px", marginRight: "18px" }}>
              <label
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: labelColor,
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <motion.input
                  whileFocus={{
                    boxShadow: "0 0 10px rgba(37,99,235,0.2)",
                    borderColor: "#38bdf8",
                  }}
                  transition={{ type: "spring", stiffness: 250 }}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${borderColor}`,
                    outline: "none",
                    fontSize: "15px",
                    background: inputBg,
                    color: textColor,
                    transition: "all 0.2s ease-in-out",
                  }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                      color={theme === "light" ? "#64748b" : "#cbd5e1"}
                    />
                  ) : (
                    <Eye
                      size={20}
                      color={theme === "light" ? "#64748b" : "#cbd5e1"}
                    />
                  )}
                </span>
              </div>
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 18px rgba(37,99,235,0.3)",
                background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "14px",
                padding: "13px 0",
                cursor: "pointer",
                fontSize: "16px",
                letterSpacing: "0.4px",
              }}
            >
              Register ✨
            </motion.button>
          </motion.form>

          {/* Login Link */}
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: theme === "light" ? "#475569" : "#cbd5e1",
              fontSize: "14px",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Login here
            </Link>
          </p>

          {/* Message */}
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: message.includes("Error")
                  ? "#dc2626"
                  : theme === "light"
                  ? "#2563eb"
                  : "#60a5fa",
                fontWeight: "500",
              }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;
