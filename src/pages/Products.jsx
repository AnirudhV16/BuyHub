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
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
            )}
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">${product.price}</div>
              <div className="product-stock">
                Stock: {product.stockQuantity}
              </div>
              {user && (
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stockQuantity === 0}
                >
                  {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
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
