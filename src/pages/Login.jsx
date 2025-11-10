// src/pages/Login.jsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../ThemeContext"; // ✅ Only useTheme — no ThemeToggle import

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      alert("✅ Login successful!");
      navigate("/room");
    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage(err.response?.data?.error || "Invalid email or password");
    }
  };

  // Forgot Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await API.post("/forgot-password", { email: resetEmail });
      alert("📩 Password reset link sent!");
      setShowReset(false);
      setResetEmail("");
    } catch (err) {
      alert("❌ Unable to send reset link.");
    }
  };

  // 3D Tilt Animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width;
    const yVal = (e.clientY - rect.top) / rect.height;
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
      : "radial-gradient(circle at top left, #020617, #0f172a 40%, #1e3a8a 100%)";

  const cardBackground =
    theme === "light"
      ? "rgba(255,255,255,0.85)"
      : "rgba(30,41,59,0.8)";

  const textColor = theme === "light" ? "#0f172a" : "#f8fafc";
  const labelColor = theme === "light" ? "#334155" : "#cbd5e1";
  const inputBg =
    theme === "light" ? "rgba(255,255,255,0.95)" : "rgba(15,23,42,0.7)";
  const borderColor =
    theme === "light" ? "#e2e8f0" : "rgba(148,163,184,0.4)";

  return (
    <div
      style={{
        minHeight: "100vh",
        background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
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

      <motion.div
        style={{
          perspective: 1000,
          width: "100%",
          maxWidth: "380px",
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
            borderRadius: "20px",
            padding: "32px 24px",
            boxShadow:
              theme === "light"
                ? "0 8px 28px rgba(0,0,0,0.1)"
                : "0 12px 45px rgba(59,130,246,0.35)",
            color: textColor,
            transition: "all 0.3s ease",
          }}
        >
          <motion.h2
            initial={{ y: -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: "clamp(20px,4.5vw,26px)",
              backgroundImage:
                theme === "light"
                  ? "linear-gradient(90deg,#2563eb,#06b6d4)"
                  : "linear-gradient(90deg,#93c5fd,#38bdf8)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow:
                theme === "dark"
                  ? "0 0 10px rgba(96,165,250,0.4)"
                  : "0 0 5px rgba(37,99,235,0.15)",
              marginBottom: "28px",
              userSelect: "none",
            }}
          >
            Welcome Back 👋
          </motion.h2>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Email */}
            <div style={{ marginBottom: "18px" ,marginRight:"18px"}}>
              <label style={{ ...labelStyle, color: labelColor }}>Email</label>
              <motion.input
                whileFocus={{
                  boxShadow: "0 0 8px rgba(37,99,235,0.2)",
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
                  ...inputStyle,
                  background: inputBg,
                  color: textColor,
                  border: `1.5px solid ${borderColor}`,
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "18px" ,marginRight:"18px"}}>
              <label style={{ ...labelStyle, color: labelColor }}>Password</label>
              <div style={{ position: "relative" }}>
                <motion.input
                  whileFocus={{
                    boxShadow: "0 0 8px rgba(37,99,235,0.2)",
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
                    ...inputStyle,
                    background: inputBg,
                    color: textColor,
                    border: `1.5px solid ${borderColor}`,
                  }}
                />
                <span onClick={() => setShowPassword(!showPassword)} style={iconStyle}>
                  {showPassword ? (
                    <EyeOff size={18} color={theme === "light" ? "#64748b" : "#cbd5e1"} />
                  ) : (
                    <Eye size={18} color={theme === "light" ? "#64748b" : "#cbd5e1"} />
                  )}
                </span>
              </div>

              <div style={{ textAlign: "right", marginTop: "5px" }}>
                <span
                  onClick={() => setShowReset(true)}
                  style={{
                    cursor: "pointer",
                    color: "#2563eb",
                    fontWeight: 600,
                    fontSize: "12px",
                  }}
                >
                  Forgot Password?
                </span>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(37,99,235,0.3)",
                background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="submit"
              style={buttonStyle}
            >
              Login 🔑
            </motion.button>
          </motion.form>

          <p
            style={{
              textAlign: "center",
              marginTop: "12px",
              color: theme === "light" ? "#475569" : "#cbd5e1",
              fontSize: "13px",
            }}
          >
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Register here
            </Link>
          </p>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                marginTop: "16px",
                color: message.includes("failed")
                  ? "#dc2626"
                  : theme === "light"
                  ? "#2563eb"
                  : "#60a5fa",
                fontWeight: 500,
                fontSize: "13px",
              }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalOverlay}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{
                ...modalCard,
                background: theme === "light" ? "#ffffff" : "#1e293b",
                color: textColor,
              }}
            >
              <h4 style={{ marginBottom: "10px", color: "#2563eb" }}>Reset Password</h4>
              <p
                style={{
                  fontSize: "13px",
                  color: theme === "light" ? "#475569" : "#cbd5e1",
                  marginBottom: "8px",
                }}
              >
                Enter your email to receive a reset link.
              </p>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your registered email"
                style={modalInput}
                required
              />
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <button
                  onClick={handleResetPassword}
                  style={{
                    ...modalBtn,
                    background: "linear-gradient(135deg,#38bdf8,#2563eb)",
                    color: "white",
                  }}
                >
                  Send
                </button>
                <button
                  onClick={() => setShowReset(false)}
                  style={{
                    ...modalBtn,
                    background: "#e2e8f0",
                    color: "#1e293b",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 🎨 Styles
const labelStyle = {
  fontWeight: 600,
  fontSize: "13px",
  marginBottom: "6px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  outline: "none",
  fontSize: "14px",
  transition: "all 0.2s ease-in-out",
};

const iconStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

const buttonStyle = {
  width: "100%",
  background: "linear-gradient(135deg,#38bdf8,#2563eb)",
  color: "white",
  fontWeight: 600,
  border: "none",
  borderRadius: "12px",
  padding: "11px 0",
  cursor: "pointer",
  fontSize: "15px",
  letterSpacing: "0.3px",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
  padding: "12px",
};

const modalCard = {
  padding: "20px 22px",
  borderRadius: "14px",
  width: "100%",
  maxWidth: "320px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  textAlign: "center",
};

const modalInput = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  outline: "none",
  marginTop: "8px",
  fontSize: "13px",
};

const modalBtn = {
  flex: 1,
  border: "none",
  padding: "8px 0",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.2s",
};

export default Login;
