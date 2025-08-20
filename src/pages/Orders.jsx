/** @format */

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    // Since there's no get orders endpoint in the backend,
    // we'll simulate some order data for display purposes
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          orderDate: "2024-01-15",
          status: "DELIVERED",
          totalAmount: 129.99,
          items: [
            { productName: "Wireless Headphones", quantity: 1, price: 99.99 },
            { productName: "Phone Case", quantity: 2, price: 15.0 },
          ],
        },
        {
          id: 2,
          orderDate: "2024-01-20",
          status: "SHIPPED",
          totalAmount: 89.99,
          items: [
            { productName: "Bluetooth Speaker", quantity: 1, price: 89.99 },
          ],
        },
        {
          id: 3,
          orderDate: "2024-01-25",
          status: "PROCESSING",
          totalAmount: 199.99,
          items: [{ productName: "Smart Watch", quantity: 1, price: 199.99 }],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "#28a745";
      case "SHIPPED":
        return "#17a2b8";
      case "PROCESSING":
        return "#ffc107";
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
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your order history</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet.</p>
          <button
            className="start-shopping-btn"
            onClick={() => (window.location.href = "/products")}
          >
            Start Shopping
          </button>
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
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-details">
                      <span className="item-name">{item.productName}</span>
                      <span className="item-quantity">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <div className="item-price">${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                </div>
                <div className="order-actions">
                  {order.status === "PROCESSING" && (
                    <button className="cancel-order-btn">Cancel Order</button>
                  )}
                  {order.status === "DELIVERED" && (
                    <button className="reorder-btn">Reorder</button>
                  )}
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
