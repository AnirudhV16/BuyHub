/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Home.css";

const Home = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to Our <span className="gradient-text">Modern Store</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing products with seamless shopping experience
            </p>

            {!user ? (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                {isAdmin() ? (
                  <>
                    <Link to="/admin" className="btn btn-primary">
                      Admin Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/Products" className="btn btn-primary">
                      Shop Now
                    </Link>
                    <Link to="/cart" className="btn btn-secondary">
                      View Cart
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title text-center mb-8">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Safe and secure payment processing with Razorpay</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Quality Guarantee</h3>
              <p>100% authentic products with quality assurance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Shopping</h3>
              <p>User-friendly interface for seamless shopping</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of satisfied customers</p>
            {!user && (
              <Link to="/register" className="btn btn-primary">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
