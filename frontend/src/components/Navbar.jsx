/** @format */

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🛍️</span>
          EcomStore
        </Link>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`nav-link ${isActive("/products") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>

          {user ? (
            <>
              {user.role === "ROLE_ADMIN" && (
                <Link
                  to="/admin"
                  className={`nav-link admin-link ${
                    isActive("/admin") ? "active" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}

              {user.role !== "ROLE_ADMIN" && (
                <>
                  <Link
                    to="/cart"
                    className={`nav-link cart-link ${
                      isActive("/cart") ? "active" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart{" "}
                    {cartItemCount > 0 && (
                      <span className="cart-badge">{cartItemCount}</span>
                    )}
                  </Link>
                  <Link
                    to="/orders"
                    className={`nav-link ${
                      isActive("/orders") ? "active" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </>
              )}

              <div className="nav-user">
                <span className="user-greeting">Hi, {user.username}!</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link
                to="/login"
                className={`nav-link auth-link ${
                  isActive("/login") ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`nav-link auth-link register ${
                  isActive("/register") ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div
          className="nav-hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
