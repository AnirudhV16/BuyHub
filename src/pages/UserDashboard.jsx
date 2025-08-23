/** @format */

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import api from "../services/api"; // ✅ use centralized axios instance
import "./Dashboard.css";

const UserDashboard = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    fetchUserData();
  }, [user, token, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Added /api prefix
      const ordersResponse = await api.get(`/api/orders/user/${user.id}`);
      setUserOrders(ordersResponse.data);

      // Calculate user stats from orders
      const orders = ordersResponse.data;
      const stats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0
        ),
        pendingOrders: orders.filter((order) => order.status === "PENDING")
          .length,
        completedOrders: orders.filter((order) => order.status === "DELIVERED")
          .length,
        recentOrder: orders.length > 0 ? orders[0] : null,
      };
      setUserStats(stats);
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(
          `Failed to load dashboard data: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "#28a745";
      case "SHIPPED":
        return "#17a2b8";
      case "PAID":
        return "#007bff";
      case "PROCESSING":
        return "#ffc107";
      case "PENDING":
        return "#6c757d";
      case "CANCELLED":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName || user?.email}!</h1>
        <p>Here's an overview of your account and recent activity</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* User Stats */}
      {userStats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{userStats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <div className="stat-card">
            <h3>{formatCurrency(userStats.totalSpent)}</h3>
            <p>Total Spent</p>
          </div>
          <div className="stat-card">
            <h3>{userStats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
          <div className="stat-card">
            <h3>{userStats.completedOrders}</h3>
            <p>Completed Orders</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/products" className="action-btn primary">
            Browse Products
          </Link>
          <Link to="/orders" className="action-btn secondary">
            View All Orders
          </Link>
          <Link to="/profile" className="action-btn secondary">
            Update Profile
          </Link>
          <Link to="/cart" className="action-btn secondary">
            View Cart
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {userOrders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="shop-now-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {userOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h4>Order #{order.id}</h4>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p>Date: {formatDate(order.orderDate)}</p>
                  <p>Items: {order.orderItems?.length || 0}</p>
                  <p>Total: {formatCurrency(order.totalPrice)}</p>
                </div>
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="order-items">
                    {order.orderItems.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="order-item">
                        {item.product?.name || `Product ID: ${item.productId}`}{" "}
                        x{item.quantity}
                      </div>
                    ))}
                    {order.orderItems.length > 2 && (
                      <p className="more-items">
                        +{order.orderItems.length - 2} more items
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="account-info">
        <h2>Account Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
          <div className="info-item">
            <label>Name:</label>
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <div className="info-item">
            <label>Member Since:</label>
            <span>{user?.createdAt ? formatDate(user.createdAt) : "N/A"}</span>
          </div>
          <div className="info-item">
            <label>Account Type:</label>
            <span>{user?.role || "Customer"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
