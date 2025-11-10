// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import RoomSelect from "./pages/RoomSelect";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AppLayout from "./Layouts/AppLayout";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  const lastRoom = localStorage.getItem("lastRoom");

  return (
    <Router>
      <Routes>
        {/* ✅ Common layout for all routes */}
        <Route element={<AppLayout />}>
          {/* Default redirect logic */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                lastRoom ? (
                  <Navigate to={`/chat/${lastRoom}`} />
                ) : (
                  <Navigate to="/room" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Auth routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Chat & Room routes */}
          <Route path="/room" element={<RoomSelect />} />
          <Route path="/chat/:roomName" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
