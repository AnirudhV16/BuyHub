/** @format */

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import api from "../services/api"; // ✅ updated path
import "./AdminOrderManagement.css";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [orderStats, setOrderStats] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const { user, token } = useAuth();

  const ORDER_STATUSES = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  useEffect(() => {
    if (user && token) {
      fetchOrders();
      fetchOrderStats();
    }
  }, [user, token, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      let url = "/api/admin/orders"; // ✅ prefixed with /api
      if (selectedStatus !== "ALL") {
        url = `/api/admin/orders/status/${selectedStatus}`;
      }

      console.log("Fetching orders from:", url);
      const response = await api.get(url);
      console.log("Orders response:", response.data);
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        `Failed to load orders: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      console.log("Fetching order stats...");
      const response = await api.get("/api/admin/orders/stats"); // ✅ prefixed
      console.log("Stats response:", response.data);
      setOrderStats(response.data);
    } catch (err) {
      console.error("Error fetching order stats:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await api.put(
        `/api/admin/orders/${orderId}/status`, // ✅ prefixed
        { status: newStatus }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      await fetchOrderStats();

      alert(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(
        `Failed to update order status: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setUpdatingOrderId(null);
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
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

  const getStatusCount = (status) => {
    if (!orderStats) return 0;
    switch (status) {
      case "PENDING":
        return orderStats.pendingOrders || 0;
      case "PAID":
        return orderStats.paidOrders || 0;
      case "PROCESSING":
        return orderStats.processingOrders || 0;
      case "SHIPPED":
        return orderStats.shippedOrders || 0;
      case "DELIVERED":
        return orderStats.deliveredOrders || 0;
      case "CANCELLED":
        return orderStats.cancelledOrders || 0;
      default:
        return 0;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-order-management">
      <div className="admin-header">
        <h1>Order Management</h1>
        <p>Manage and track all customer orders</p>
      </div>

      {/* ✅ Order Statistics */}
      {orderStats && (
        <div className="order-stats">
          <div className="stat-card">
            <h3>{orderStats.totalOrders || 0}</h3>
            <p>Total Orders</p>
          </div>
          <div className="stat-card">
            <h3>{orderStats.pendingOrders || 0}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{orderStats.paidOrders || 0}</h3>
            <p>Paid</p>
          </div>
          <div className="stat-card">
            <h3>{orderStats.processingOrders || 0}</h3>
            <p>Processing</p>
          </div>
          <div className="stat-card">
            <h3>{orderStats.shippedOrders || 0}</h3>
            <p>Shipped</p>
          </div>
          <div className="stat-card">
            <h3>{orderStats.deliveredOrders || 0}</h3>
            <p>Delivered</p>
          </div>
          <div className="stat-card revenue">
            <h3>{formatCurrency(orderStats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
          <div className="stat-card revenue">
            <h3>{formatCurrency(orderStats.monthlyRevenue)}</h3>
            <p>This Month</p>
          </div>
        </div>
      )}

      {/* ✅ Status Filter */}
      <div className="status-filter">
        <button
          className={selectedStatus === "ALL" ? "active" : ""}
          onClick={() => setSelectedStatus("ALL")}
        >
          All Orders ({orderStats?.totalOrders || 0})
        </button>
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            className={selectedStatus === status ? "active" : ""}
            onClick={() => setSelectedStatus(status)}
          >
            {status} ({getStatusCount(status)})
          </button>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ✅ Orders Table */}
      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>
            No {selectedStatus === "ALL" ? "" : selectedStatus.toLowerCase()}{" "}
            orders found
          </h2>
        </div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.id}</strong>
                  </td>
                  <td>
                    <div className="customer-info">
                      <span>User ID: {order.userId}</span>
                      {order.user?.email && <span>{order.user.email}</span>}
                      {order.user?.firstName && order.user?.lastName && (
                        <span>
                          {order.user.firstName} {order.user.lastName}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>
                    <div className="order-items-summary">
                      <span>{order.orderItems?.length || 0} items</span>
                      {order.orderItems?.length > 0 && (
                        <div className="items-tooltip">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx}>
                              {item.product?.name ||
                                `Product ID: ${item.productId}`}{" "}
                              x{item.quantity}
                              {item.price && (
                                <span> - {formatCurrency(item.price)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <strong>{formatCurrency(order.totalPrice)}</strong>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="order-actions">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        disabled={updatingOrderId === order.id}
                        className="status-select"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {updatingOrderId === order.id && (
                        <span className="updating">Updating...</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
