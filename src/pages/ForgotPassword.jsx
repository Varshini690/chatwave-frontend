import React, { useState } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/forgot-password", { email });
      setMessage(res.data.message);
      setShowSuccess(true);
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(120deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        padding: "16px",
        overflowX: "hidden",
      }}
    >
      {/* 🌈 Forgot Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "20px",
          padding: "30px 24px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
          margin: "0 auto",
        }}
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: "center",
            fontWeight: "700",
            fontSize: "clamp(20px, 4.5vw, 26px)",
            background: "linear-gradient(90deg, #2563eb, #06b6d4)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "28px",
          }}
        >
          Forgot Password? 🔑
        </motion.h2>

        {/* 🧾 Form */}
        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#334155",
              fontSize: "13px",
            }}
          >
            Enter your email
          </label>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1.5px solid #e2e8f0",
              outline: "none",
              fontSize: "14px",
              background: "rgba(255,255,255,0.95)",
              color: "#0f172a",
              transition: "all 0.2s ease-in-out",
            }}
          />

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(37,99,235,0.3)",
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
              borderRadius: "12px",
              padding: "11px 0",
              cursor: "pointer",
              fontSize: "15px",
              marginTop: "22px",
              letterSpacing: "0.3px",
            }}
          >
            Send Reset Link
          </motion.button>
        </form>

        {/* 💬 Message */}
        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "18px",
              color: message.includes("✅") ? "#16a34a" : "#dc2626",
              fontWeight: "500",
              fontSize: "13px",
            }}
          >
            {message}
          </p>
        )}

        {/* 🔗 Back to Login */}
        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            color: "#475569",
            fontSize: "13px",
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
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0,0,0,0.4)",
              zIndex: 999,
              overflow: "hidden",
              padding: "0 16px",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "22px 20px",
                textAlign: "center",
                width: "100%",
                maxWidth: "320px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                margin: "auto",
              }}
            >
              {/* ✅ Checkmark Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#22c55e"
                  style={{ width: "60px", height: "60px", margin: "0 auto" }}
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

              <h3
                style={{
                  marginTop: "16px",
                  color: "#16a34a",
                  fontWeight: "700",
                }}
              >
                Email Sent Successfully 🎉
              </h3>
              <p
                style={{
                  color: "#475569",
                  marginTop: "8px",
                  fontSize: "13px",
                }}
              >
                Check your inbox for the password reset link.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setShowSuccess(false)}
                style={{
                  marginTop: "20px",
                  background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px 18px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ForgotPassword;
