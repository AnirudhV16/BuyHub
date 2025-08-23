/** @format */

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";
import Loading from "../components/Loading";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState(new Set());
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("api/products");
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      alert("Product added to cart!");
    } catch (err) {
      alert("Failed to add product to cart");
    }
  };

  // Handle image load errors
  const handleImageError = (productId) => {
    setImageErrors((prev) => new Set([...prev, productId]));
  };

  // helper function to check if user is admin - fixed to use 'role' instead of 'roles'
  const isAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ADMIN";

  // Debug logging to check admin status
  useEffect(() => {
    if (user) {
      console.log("User object:", user);
      console.log("User role:", user.role);
      console.log("Is admin:", isAdmin);
    }
  }, [user, isAdmin]);

  if (loading) return <Loading />;

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Discover amazing products at great prices</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              {product.imageUrl && !imageErrors.has(product.id) ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                  onError={() => handleImageError(product.id)}
                />
              ) : (
                <div className="default-product-image">
                  <div className="product-placeholder">
                    <div className="placeholder-icon">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="placeholder-text">{product.name}</div>
                    <div className="placeholder-subtext">
                      No Image Available
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">${product.price}</div>

              {/* Show Add to Cart only if user is logged in and is NOT admin */}
              {user && !isAdmin && (
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
              )}

              {/* Debug info - Remove this after testing */}
              {user && isAdmin && (
                <div
                  style={{
                    background: "#e8f4f8",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "0.9rem",
                    color: "#2c3e50",
                    textAlign: "center",
                  }}
                >
                  👨‍💼 Admin View - No Cart Actions
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="no-products">
          <h2>No products available</h2>
          <p>Check back later for new arrivals!</p>
        </div>
      )}
    </div>
  );
};

export default Products;
