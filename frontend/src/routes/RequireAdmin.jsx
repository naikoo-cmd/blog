import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/adminSession";

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const authenticated = isAdminAuthenticated();

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAdmin;

