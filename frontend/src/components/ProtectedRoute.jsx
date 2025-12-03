import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Save the attempted URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check if user is trying to access admin routes
  if (location.pathname.startsWith('/admin') && !user.isAdmin) {
    // Redirect non-admin users to home
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
