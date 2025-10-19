/** @format */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "ROLE_ADMIN") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          margin: "2rem auto",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>
          Access Denied
        </h2>
        <p>You don't have admin privileges to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
