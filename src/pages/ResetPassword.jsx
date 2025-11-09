import React, { useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/reset-password/${token}`, {
        password,
      });

      setMessage("✅ " + res.data.message);
      setShowSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Reset error:", err);
      setMessage("❌ " + (err.response?.data?.error || "Invalid or expired link"));
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    navigate("/login");
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
      {/* 🌈 Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "420px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "24px",
          padding: "45px 40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: "center",
            fontWeight: "700",
            fontSize: "26px",
            background: "linear-gradient(90deg, #2563eb, #06b6d4)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "35px",
          }}
        >
          Reset Your Password 🔐
        </motion.h2>

        {/* 🧾 Form */}
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>New Password</label>
          <div style={inputWrapperStyle}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <label style={{ ...labelStyle, marginTop: "15px" }}>
            Confirm Password
          </label>
          <div style={inputWrapperStyle}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={iconStyle}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color="#64748b" />
              ) : (
                <Eye size={20} color="#64748b" />
              )}
            </span>
          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(37,99,235,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            type="submit"
            style={buttonStyle}
          >
            Update Password 🔑
          </motion.button>
        </form>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: message.includes("❌") ? "#dc2626" : "#16a34a",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            color: "#475569",
            fontSize: "14px",
          }}
        >
          Remember your password?{" "}
          <Link
            to="/login"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Go back to Login
          </Link>
        </p>
      </motion.div>

      {/* 🎉 Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={overlayStyle}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              style={popupStyle}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#22c55e"
                  style={{ width: "70px", height: "70px", margin: "0 auto" }}
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>

              <h3 style={{ marginTop: "20px", color: "#16a34a", fontWeight: "700" }}>
                Password Updated Successfully 🎉
              </h3>
              <p style={{ color: "#475569", marginTop: "10px", fontSize: "14px" }}>
                You can now log in with your new password.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={handleClose}
                style={popupBtnStyle}
              >
                Go to Login
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#334155",
};

const inputWrapperStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
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
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
  marginTop: "25px",
  letterSpacing: "0.4px",
};

const overlayStyle = {
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

const popupStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "40px 50px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const popupBtnStyle = {
  marginTop: "25px",
  background: "linear-gradient(135deg, #38bdf8, #2563eb)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "10px 20px",
  cursor: "pointer",
  fontWeight: "600",
};

export default ResetPassword;
