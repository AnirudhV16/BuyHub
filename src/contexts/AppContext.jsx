/** @format */
import { createContext, useReducer } from "react";
import { CartReducer } from "./CartReducer";

export const AppContext = createContext();

const initialState = {
  cart: [],
  auth: { user: null }, // null means not logged in
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, initialState);

  const login = (user) => {
    dispatch({ type: "LOGIN", payload: user });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // --- CART ---
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const increaseQuantity = (id) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: id });
  };

  const decreaseQuantity = (id) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
