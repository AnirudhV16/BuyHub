/** @format */

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const response = await api.post("/api/user/login", userData);
      const receivedToken = response.data;

      if (receivedToken) {
        setToken(receivedToken);

        // Decode token to get user info (basic JWT decode)
        const tokenPayload = JSON.parse(atob(receivedToken.split(".")[1]));
        // Debug: Check what's in the token payload
        console.log("JWT Token payload:", tokenPayload);
        console.log("Token authorities:", tokenPayload.authorities);
        console.log("Token username:", tokenPayload.username);

        const userInfo = {
          id: parseInt(tokenPayload.sub), // This is now the user ID from database
          username: tokenPayload.username, // Username from token claims
          role: tokenPayload.authorities, // Role from token claims
        };

        // Debug: Check the final user info
        console.log("User info created:", userInfo);
        console.log("Final role value:", userInfo.role);
        console.log("Role type:", typeof userInfo.role);

        setUser(userInfo);

        // Store in localStorage
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(userInfo));

        // Set axios default header
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${receivedToken}`;

        return { success: true, user: userInfo };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/api/user/register", userData);
      if (response.data) {
        return { success: true, user: response.data };
      }
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: error.response?.data || "Registration failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  const isAdmin = () => {
    return user?.role === "ROLE_ADMIN";
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
