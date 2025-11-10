// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import RoomSelect from "./pages/RoomSelect";
import AppLayout from "./Layouts/AppLayout";


function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  const lastRoom = localStorage.getItem("lastRoom");

  return (
    <Router>
      {/* ✅ Draggable Theme Button outside Routes (works globally) */}
      

      <Routes>
        {/* ✅ All pages wrapped inside AppLayout */}
        <Route element={<AppLayout />}>
          {/* Default route logic */}
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

          {/* Room selection page */}
          <Route path="/room" element={<RoomSelect />} />

          {/* Chat route */}
          <Route path="/chat/:roomName" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
