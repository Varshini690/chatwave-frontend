import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 👁️ Show/Hide icons

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", form, {
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

  // 3D Tilt
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
      }}
    >
      {/* 🌈 3D Card */}
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
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
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
            Create Your Account 🌊
          </motion.h2>

          {/* 🧾 Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Username */}
            <div style={{ marginBottom: "22px" }}>
              <label style={labelStyle}>Username</label>
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
                style={inputStyle}
              />
            </div>

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
                  {showPassword ? (
                    <EyeOff size={20} color="#64748b" />
                  ) : (
                    <Eye size={20} color="#64748b" />
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
              style={buttonStyle}
            >
              Register ✨
            </motion.button>
          </motion.form>

          {/* Login Link */}
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: "#475569",
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

          {/* 💬 Message */}
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: message.includes("Error") ? "#dc2626" : "#2563eb",
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
  transition: "all 0.2s ease-in-out",
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

export default Register;
