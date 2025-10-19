/** @format */

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      initializeCart();
    } else {
      setCartId(null);
      setCartItemCount(0);
    }
  }, [user]);

  const initializeCart = async () => {
    try {
      // Convert user.id to number for backend
      const userId = Number(user.id);

      const response = await api.get(`/api/cart/user/${userId}`);
      setCartId(response.data.id);
      await updateCartItemCount(response.data.id);
    } catch (error) {
      console.error("Error initializing cart:", error);

      // If cart doesn't exist, create one
      try {
        const userId = Number(user.id);
        const createResponse = await api.post(`/api/cart/create/${userId}`);
        setCartId(createResponse.data.id);
      } catch (createError) {
        console.error("Error creating cart:", createError);
      }
    }
  };

  const updateCartItemCount = async (cartIdToUse = cartId) => {
    if (!cartIdToUse) return;

    try {
      const response = await api.get(`/api/cart/${cartIdToUse}/items`);
      const totalItems = response.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartItemCount(totalItems);
    } catch (error) {
      console.error("Error updating cart item count:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!cartId) {
      throw new Error("Cart not initialized");
    }

    try {
      await api.post(
        `/api/cart/${cartId}/add/${productId}?quantity=${quantity}`
      );
      await updateCartItemCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!cartId) {
      throw new Error("Cart not initialized");
    }

    try {
      await api.delete(`/api/cart/${cartId}/remove/${productId}`);
      await updateCartItemCount();
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const clearCart = () => {
    setCartId(null);
    setCartItemCount(0);
  };

  const value = {
    cartId,
    cartItemCount,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
