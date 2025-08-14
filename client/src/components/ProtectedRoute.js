import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ⏳ Wait for auth check before deciding
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  // 🔒 Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  console.log("ProtectedRoute - loading:", loading);
  console.log("ProtectedRoute - user:", user);

  // ✅ Authenticated user
  return children;
};

export default ProtectedRoute;
