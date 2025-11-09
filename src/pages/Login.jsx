import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      alert("✅ Login successful!");
      navigate("/room");
    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage(err.response?.data?.error || "Invalid email or password");
    }
  };

  // 🧭 Handle Password Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/forgot-password", { email: resetEmail });
      alert("📩 Password reset link sent to your email!");
      setShowReset(false);
      setResetEmail("");
    } catch (err) {
      alert("❌ Unable to send reset link. Please check your email.");
    }
  };

  // 🪄 3D Tilt
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        position: "relative",
      }}
    >
      {/* 🔹 Main Login Card */}
      <motion.div
        style={{ perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            width: "420px",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(25px)",
            borderRadius: "24px",
            padding: "50px 45px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease",
          }}
        >
          {/* ✨ Title */}
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              textAlign: "center",
              fontWeight: "700",
              fontSize: "27px",
              background: "linear-gradient(90deg, #2563eb, #06b6d4)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "35px",
            }}
          >
            Welcome Back 👋
          </motion.h2>

          {/* 🧾 Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Email */}
            <div style={{ marginBottom: "22px" }}>
              <label style={labelStyle}>Email</label>
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
                style={inputStyle}
              />
            </div>

            {/* Password with 👁️ toggle */}
            <div style={{ marginBottom: "22px" }}>
              <label style={labelStyle}>Password</label>
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
                  style={inputStyle}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={iconStyle}
                >
                  {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                </span>
              </div>

              {/* Forgot Password */}
              <div style={{ textAlign: "right", marginTop: "5px" }}>
                <span
                  onClick={() => setShowReset(true)}
                  style={{
                    cursor: "pointer",
                    color: "#2563eb",
                    fontWeight: "600",
                    fontSize: "13px",
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
                boxShadow: "0 0 18px rgba(37,99,235,0.3)",
                background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="submit"
              style={buttonStyle}
            >
              Login 🔑
            </motion.button>
          </motion.form>

          {/* Register Link */}
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: "#475569",
              fontSize: "14px",
            }}
          >
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Register here
            </Link>
          </p>

          {/* 💬 Message */}
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: message.includes("failed") ? "#dc2626" : "#2563eb",
                fontWeight: "500",
              }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* 📨 Forgot Password Modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalOverlay}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              style={modalCard}
            >
              <h4 style={{ marginBottom: "15px", color: "#2563eb" }}>Reset Password</h4>
              <p style={{ fontSize: "14px", color: "#475569", marginBottom: "10px" }}>
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
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button
                  onClick={handleResetPassword}
                  style={{
                    ...modalBtn,
                    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                    color: "white",
                  }}
                >
                  Send Link
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

const labelStyle = {
  fontWeight: "600",
  fontSize: "14px",
  color: "#334155",
  marginBottom: "8px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1.5px solid #e2e8f0",
  outline: "none",
  fontSize: "15px",
  background: "rgba(255, 255, 255, 0.95)",
  color: "#0f172a",
};

const iconStyle = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

const buttonStyle = {
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
};

const modalCard = {
  background: "white",
  padding: "25px 30px",
  borderRadius: "16px",
  width: "360px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  textAlign: "center",
};

const modalInput = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  outline: "none",
  marginTop: "10px",
  fontSize: "14px",
};

const modalBtn = {
  flex: 1,
  border: "none",
  padding: "10px 0",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.2s",
};

export default Login;
