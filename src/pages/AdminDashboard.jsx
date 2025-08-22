/** @format */

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Loading from "../components/Loading";
import AdminOrderManagement from "../components/AdminOrderManagement";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user && user.role === "ROLE_ADMIN") {
      if (activeTab === "products") {
        fetchProducts();
      } else if (activeTab === "overview") {
        fetchDashboardStats();
      }
    }
  }, [user, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products");
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch order stats and product count
      const [orderStatsResponse, productsResponse] = await Promise.all([
        api.get("/api/admin/orders/stats"),
        api.get("/api/products"),
      ]);

      setDashboardStats({
        ...orderStatsResponse.data,
        totalProducts: productsResponse.data.length,
        lowStockProducts: productsResponse.data.filter((p) => p.stock < 10)
          .length, // assuming you have stock field
      });
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append("product", JSON.stringify(formData));

    if (imageFile) {
      productData.append("image", imageFile);
    }

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setEditingProduct(null);
      } else {
        await api.post("/api/products", productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setShowAddForm(false);
      }

      resetForm();
      await fetchProducts();
      alert("Product saved successfully!");
    } catch (err) {
      alert("Failed to save product");
      console.error("Save error:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/api/products/${productId}`);
        await fetchProducts();
        alert("Product deleted successfully!");
      } catch (err) {
        alert("Failed to delete product");
        console.error("Delete error:", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
    });
    setImageFile(null);
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (user?.role !== "ROLE_ADMIN") {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your ecommerce store</p>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders
        </button>
        <button
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          🛍️ Products
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="overview-tab">
          <h2>Dashboard Overview</h2>
          {loading ? (
            <Loading />
          ) : dashboardStats ? (
            <div className="dashboard-stats">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <h3>{dashboardStats.totalOrders}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h3>{formatCurrency(dashboardStats.totalRevenue)}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <h3>{formatCurrency(dashboardStats.monthlyRevenue)}</h3>
                    <p>This Month</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🛍️</div>
                  <div className="stat-content">
                    <h3>{dashboardStats.totalProducts || 0}</h3>
                    <p>Total Products</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-content">
                    <h3>{dashboardStats.pendingOrders}</h3>
                    <p>Pending Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🚚</div>
                  <div className="stat-content">
                    <h3>{dashboardStats.shippedOrders}</h3>
                    <p>Shipped Orders</p>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab("orders")}
                  >
                    View All Orders
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab("products")}
                  >
                    Manage Products
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => {
                      setActiveTab("products");
                      setShowAddForm(true);
                    }}
                  >
                    Add New Product
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No statistics available</p>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="orders-tab">
          <AdminOrderManagement />
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="products-tab">
          <div className="products-header">
            <h2>Manage Products</h2>
            <button
              className="add-product-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Cancel" : "Add New Product"}
            </button>
          </div>

          {showAddForm && (
            <div className="product-form-container">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <Loading />
          ) : (
            <div className="products-table">
              {products.length === 0 ? (
                <p>No products found. Add your first product!</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-thumbnail"
                              />
                            ) : (
                              <div className="no-image">No Image</div>
                            )}
                          </td>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>${product.price}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleEdit(product)}
                                className="edit-btn"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="delete-btn"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
