/** @format */

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import api from "../services/api";
import "./Orders.css";
import { useNotifications } from "../components/Notifications";

const Orders = () => {
  const { showSuccess, showError } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      fetchOrders();
    }
  }, [user, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/orders/user/${user.id}`);

      let filteredOrders = response.data;
      if (selectedStatus !== "ALL") {
        filteredOrders = response.data.filter(
          (order) => order.status === selectedStatus
        );
      }

      setOrders(filteredOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.put(`/api/orders/${orderId}/user/${user.id}/cancel`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      showError("Failed to cancel order. Please try again.");
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Order Placed",
      PAID: "Payment Confirmed",
      PROCESSING: "Being Prepared",
      SHIPPED: "On the Way",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    };
    return statusMap[status] || status;
  };

  if (loading) return <Loading />;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your order history</p>
      </div>

      {/* Status Filter - Added CANCELLED */}
      <div className="status-filter">
        {["ALL", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map(
          (status) => (
            <button
              key={status}
              className={selectedStatus === status ? "active" : ""}
              onClick={() => handleStatusFilter(status)}
            >
              {status === "ALL"
                ? "All Orders"
                : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          )
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>
            {selectedStatus === "ALL"
              ? "No orders found"
              : `No ${selectedStatus.toLowerCase()} orders found`}
          </h2>
          <p>
            {selectedStatus === "ALL"
              ? "You haven't placed any orders yet."
              : `You don't have any ${selectedStatus.toLowerCase()} orders.`}
          </p>
          {selectedStatus === "ALL" && (
            <button
              className="start-shopping-btn"
              onClick={() => (window.location.href = "/products")}
            >
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p>Placed on {formatDate(order.orderDate)}</p>
                </div>
                <div className="order-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items ({order.orderItems?.length || 0}):</h4>
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-details">
                      <div className="item-info">
                        <span className="item-name">{item.product.name}</span>
                        <span className="item-description">
                          {item.product.description}
                        </span>
                      </div>
                      <span className="item-quantity">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <div className="item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                      <span className="unit-price">
                        (₹{item.price.toFixed(2)} each)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ₹{order.totalPrice.toFixed(2)}</strong>
                </div>
                <div className="order-actions">
                  {/* Only show Cancel button for PENDING orders */}
                  {order.status === "PENDING" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
                  {/* Show cancelled message for CANCELLED orders */}
                  {order.status === "CANCELLED" && (
                    <span className="cancelled-indicator">Order Cancelled</span>
                  )}
                  {/* Show reorder button for DELIVERED orders */}
                  {order.status === "DELIVERED" && (
                    <button className="reorder-btn">Reorder</button>
                  )}
                </div>
              </div>

              {/* Order Progress Indicator - Updated to handle CANCELLED status */}
              {order.status === "CANCELLED" ? (
                <div className="order-progress cancelled-progress">
                  <div className="cancelled-message">
                    <div className="cancelled-icon">❌</div>
                    <span>This order has been cancelled</span>
                  </div>
                </div>
              ) : (
                <div className="order-progress">
                  <div className="progress-steps">
                    <div
                      className={`step ${
                        [
                          "PENDING",
                          "PAID",
                          "PROCESSING",
                          "SHIPPED",
                          "DELIVERED",
                        ].includes(order.status)
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="step-icon">📝</div>
                      <span>Ordered</span>
                    </div>
                    <div
                      className={`step ${
                        ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(
                          order.status
                        )
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="step-icon">💳</div>
                      <span>Paid</span>
                    </div>
                    <div
                      className={`step ${
                        ["PROCESSING", "SHIPPED", "DELIVERED"].includes(
                          order.status
                        )
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="step-icon">📦</div>
                      <span>Processing</span>
                    </div>
                    <div
                      className={`step ${
                        ["SHIPPED", "DELIVERED"].includes(order.status)
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="step-icon">🚚</div>
                      <span>Shipped</span>
                    </div>
                    <div
                      className={`step ${
                        order.status === "DELIVERED" ? "completed" : ""
                      }`}
                    >
                      <div className="step-icon">✅</div>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
