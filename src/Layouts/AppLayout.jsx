import React from "react";
import { Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* 🌗 Theme Toggle visible on all pages */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
        <ThemeToggle />
      </div>

      {/* Page content goes here */}
      <Outlet />
    </div>
  );
}
