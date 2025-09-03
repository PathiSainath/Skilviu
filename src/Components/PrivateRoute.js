// src/Components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

function PrivateRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Checking session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ enforce role check strictly
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
