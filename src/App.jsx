import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import HomePage from "./pages/common/HomePage";
import Register from "./pages/common/Register";
import Login from "./pages/common/Login";
import ForgotPassword from "./pages/common/ForgotPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <ToastProvider>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
