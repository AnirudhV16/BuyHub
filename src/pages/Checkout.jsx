/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Loading from "../components/Loading";
import "./Checkout.css";

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    console.log("Checkout useEffect - orderId:", orderId, "user:", user);
    if (orderId && user && user.id) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      if (!orderId) setError("No order ID provided");
      if (!user) setError("User not logged in");
    }
  }, [orderId, user]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      // Check if orderId exists
      if (!orderId || orderId === "undefined") {
        setError("Invalid order ID");
        return;
      }

      // Use the user-specific endpoint to get order details
      const response = await api.get(`/api/orders/${orderId}/user/${user.id}`);
      setOrder(response.data);

      console.log("Order fetched successfully:", response.data);
    } catch (err) {
      console.error("Error fetching order:", err);
      if (err.response?.status === 403) {
        setError("Access denied: You don't have permission to view this order");
      } else if (err.response?.status === 404) {
        setError("Order not found");
      } else {
        setError(
          "Failed to load order details: " + (err.response?.data || err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateBillingDetails = () => {
    const required = ["name", "email", "phone", "address", "city", "zipCode"];
    for (let field of required) {
      if (!billingDetails[field].trim()) {
        alert(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById("razorpay-script");
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Validate billing details first
    if (!validateBillingDetails()) {
      return;
    }

    // Validate order status
    if (order.status !== "PENDING") {
      alert("This order cannot be paid. Status: " + order.status);
      return;
    }

    setPaymentLoading(true);
    setError("");

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      // Create payment order
      const paymentResponse = await api.post(
        `/api/payment/create-order/${orderId}/${order.totalPrice}`
      );

      const {
        orderId: razorpayOrderId,
        amount,
        currency,
        razorpayKeyId,
      } = paymentResponse.data;

      // Configure Razorpay options
      const options = {
        key: razorpayKeyId,
        amount: amount, // Amount is already in paise from backend
        currency: currency,
        name: "Your Ecommerce Store",
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            setPaymentLoading(true);

            // Verify payment
            const verifyResponse = await api.post("/api/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.data === "Payment verified successfully!") {
              alert("Payment successful! Redirecting to orders...");
              navigate("/orders");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            alert(
              "Payment verification failed. Please contact support with payment ID: " +
                response.razorpay_payment_id
            );
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: billingDetails.name,
          email: billingDetails.email,
          contact: billingDetails.phone,
        },
        notes: {
          address: billingDetails.address,
          city: billingDetails.city,
          zipCode: billingDetails.zipCode,
        },
        theme: {
          color: "#667eea",
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            // Don't show error when user intentionally closes the modal
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      // Handle payment failure
      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
        setPaymentLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(
        "Failed to initiate payment: " + (err.response?.data || err.message)
      );
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="error-message">{error || "Order not found"}</div>
          <button className="back-btn" onClick={() => navigate("/cart")}>
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        debugInfo = (
        <div
          style={{
            background: "#f0f0f0",
            padding: "10px",
            margin: "10px",
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          <h4>Debug Info:</h4>
          <p>Order ID from params: {orderId}</p>
          <p>
            User:{" "}
            {user
              ? JSON.stringify({ id: user.id, username: user.username })
              : "null"}
          </p>
          <p>Loading: {loading.toString()}</p>
          <p>Error: {error || "none"}</p>
          <p>
            Order:{" "}
            {order
              ? `Order ${order.id} - ${order.status} - $${order.totalPrice}`
              : "null"}
          </p>
        </div>
        );
        {error && <div className="error-message">{error}</div>}
        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-details">
              <div className="order-info">
                <h3>Order #{orderId}</h3>
                <p>
                  Status: <strong>{order.status}</strong>
                </p>
                <p>
                  Order Date: {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>

              {/* Order Items */}
              <div className="order-items">
                <h4>Items ({order.orderItems?.length || 0}):</h4>
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.product.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="payment-section">
                <h3>Payment Details</h3>
                <div className="payment-info">
                  <div className="payment-row">
                    <span>Subtotal:</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="payment-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="payment-row total">
                    <span>Total:</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="pay-now-btn"
                  onClick={handlePayment}
                  disabled={paymentLoading || order.status !== "PENDING"}
                >
                  {paymentLoading
                    ? "Processing..."
                    : order.status !== "PENDING"
                    ? `Order ${order.status}`
                    : `Pay $${order.totalPrice.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>

          <div className="billing-info">
            <h2>Billing Information</h2>
            <form className="billing-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={billingDetails.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={billingDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={billingDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={billingDetails.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={billingDetails.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={billingDetails.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP Code"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="checkout-actions">
          <button className="back-btn" onClick={() => navigate("/cart")}>
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
