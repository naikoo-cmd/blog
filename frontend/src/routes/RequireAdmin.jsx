import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated, isAdminAuthenticatedSync } from "../utils/adminSession";

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(null); // null = checking, true/false = result

  useEffect(() => {
    const checkAuth = async () => {
      // First do a quick sync check
      if (!isAdminAuthenticatedSync()) {
        setAuthenticated(false);
        return;
      }

      // Then verify with backend
      const isValid = await isAdminAuthenticated();
      setAuthenticated(isValid);
    };

    checkAuth();
  }, []);

  // Show nothing while checking
  if (authenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAdmin;

