/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";
import "./Checkout.css";

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // Since we don't have a get order endpoint, we'll assume order data is passed
      // You might need to modify this based on your actual order structure
      setLoading(false);
    } catch (err) {
      setError("Failed to load order details");
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // Create payment order
      const paymentResponse = await api.post(
        `/payment/create-order/${orderId}/${order?.totalAmount || 100}`
      );
      const { razorpayOrderId, amount } = paymentResponse.data;

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: "your_razorpay_key", // Replace with your Razorpay key
          amount: amount * 100, // Amount in paise
          currency: "INR",
          name: "Your Ecommerce Store",
          description: `Order #${orderId}`,
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              // Verify payment
              const verifyResponse = await api.post("/payment/verify", {
                razorpayOrderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              alert("Payment successful!");
              navigate("/orders");
            } catch (err) {
              alert("Payment verification failed");
            }
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#667eea",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      alert("Failed to initiate payment");
      console.error("Payment error:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-details">
              <div className="order-info">
                <h3>Order #{orderId}</h3>
                <p>
                  Thank you for your order! Please review the details below and
                  proceed with payment.
                </p>
              </div>

              <div className="payment-section">
                <h3>Payment Details</h3>
                <div className="payment-info">
                  <div className="payment-row">
                    <span>Subtotal:</span>
                    <span>$99.99</span>
                  </div>
                  <div className="payment-row">
                    <span>Shipping:</span>
                    <span>$9.99</span>
                  </div>
                  <div className="payment-row">
                    <span>Tax:</span>
                    <span>$10.99</span>
                  </div>
                  <div className="payment-row total">
                    <span>Total:</span>
                    <span>$120.97</span>
                  </div>
                </div>

                <button
                  className="pay-now-btn"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>

          <div className="billing-info">
            <h2>Billing Information</h2>
            <form className="billing-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" placeholder="Enter your phone number" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea placeholder="Enter your address" rows="3"></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="City" />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input type="text" placeholder="ZIP Code" />
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
