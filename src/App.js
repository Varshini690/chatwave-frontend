// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import RoomSelect from "./pages/RoomSelect";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  const lastRoom = localStorage.getItem("lastRoom");

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              lastRoom ? (
                <Navigate to={`/chat/${lastRoom}`} /> // ✅ Already has room → go chat
              ) : (
                <Navigate to="/room" /> // ✅ Logged in but no room → go to room select
              )
            ) : (
              <Navigate to="/login" /> // ✅ Not logged in → go to login
            )
          }
        />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Room selection page */}
        <Route path="/room" element={<RoomSelect />} />

        {/* Dynamic chat route */}
        <Route path="/chat/:roomName" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
