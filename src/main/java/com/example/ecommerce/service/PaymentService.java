package com.example.ecommerce.service;

import com.example.ecommerce.dto.PaymentResponse;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.commons.codec.binary.Hex;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // Create Razorpay Order and save mapping in DB
    public PaymentResponse createOrder(double amount, int dbOrderId) throws Exception {
        
        // First verify the order exists and is in PENDING state
        Order order = orderRepository.findById(dbOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + dbOrderId));
                
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Order is not in PENDING state. Current status: " + order.getStatus());
        }
        
        // Validate amount matches order total
        if (Math.abs(amount - order.getTotalPrice()) > 0.01) {
            throw new RuntimeException("Amount mismatch. Expected: " + order.getTotalPrice() + ", Provided: " + amount);
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject options = new JSONObject();
            options.put("amount", (int)(amount * 100)); // amount in paise
            options.put("currency", "INR");
            options.put("receipt", "order_" + dbOrderId + "_" + System.currentTimeMillis());
            
            // Add notes for better tracking
            JSONObject notes = new JSONObject();
            notes.put("db_order_id", dbOrderId);
            notes.put("user_id", order.getUser().getId());
            options.put("notes", notes);

            com.razorpay.Order razorpayOrder = razorpay.orders.create(options);

            order.setRazorpayOrderId(razorpayOrder.get("id"));
            order.setStatus("CREATED"); // Status when Razorpay order is created but not paid
            orderRepository.save(order);

            return new PaymentResponse(
                    razorpayOrder.get("id"),
                    razorpayOrder.get("amount"),
                    razorpayOrder.get("currency"),
                    razorpayKeyId  // needed by frontend
            );
        } catch (Exception e) {
            // If Razorpay order creation fails, keep order status as PENDING
            System.err.println("Failed to create Razorpay order: " + e.getMessage());
            throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    // Verify Payment Signature & Update DB
    public boolean verifyPayment(String razorpayOrderId, String paymentId, String signature) throws Exception {
        
        if (razorpayOrderId == null || paymentId == null || signature == null) {
            throw new RuntimeException("Missing payment verification parameters");
        }
        
        try {
            // Generate signature for verification
            String data = razorpayOrderId + "|" + paymentId;
            String generatedSignature = HmacSHA256(data, razorpayKeySecret);

            if (generatedSignature.equals(signature)) {
                // Find order by Razorpay order ID
                Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId);
                if (order == null) {
                    throw new RuntimeException("Order not found with razorpayOrderId: " + razorpayOrderId);
                }
                
                // Check if order is in correct state for payment
                if (!"CREATED".equals(order.getStatus()) && !"PENDING".equals(order.getStatus())) {
                    throw new RuntimeException("Order is not in correct state for payment. Current status: " + order.getStatus());
                }

                // Update order status and payment details
                order.setStatus("PAID");
                order.setRazorpayPaymentId(paymentId);
                orderRepository.save(order);
                
                // Now clear the cart since payment is successful
                orderService.clearCartAfterPayment(order.getId());

                System.out.println("Payment verified successfully for order: " + order.getId());
                return true;
            } else {
                System.err.println("Payment signature verification failed for order: " + razorpayOrderId);
                System.err.println("Expected: " + generatedSignature);
                System.err.println("Received: " + signature);
                
                // Update order status to FAILED
                Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId);
                if (order != null) {
                    order.setStatus("PAYMENT_FAILED");
                    orderRepository.save(order);
                }
                
                return false;
            }
        } catch (Exception e) {
            System.err.println("Error during payment verification: " + e.getMessage());
            
            // Update order status to FAILED on exception
            try {
                Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId);
                if (order != null) {
                    order.setStatus("PAYMENT_FAILED");
                    orderRepository.save(order);
                }
            } catch (Exception dbError) {
                System.err.println("Failed to update order status to PAYMENT_FAILED: " + dbError.getMessage());
            }
            
            throw new RuntimeException("Payment verification failed: " + e.getMessage(), e);
        }
    }

    // Helper method for HMAC SHA256
    private String HmacSHA256(String data, String secret) throws Exception {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes());
            return new String(Hex.encodeHex(hash));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC signature: " + e.getMessage(), e);
        }
    }
    
    // Additional method to check payment status
    public String getPaymentStatus(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return order.getStatus();
    }
    
    // Method to handle payment failure cleanup
    public void handlePaymentFailure(String razorpayOrderId, String reason) {
        try {
            Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId);
            if (order != null) {
                order.setStatus("PAYMENT_FAILED");
                orderRepository.save(order);
                System.out.println("Payment failed for order: " + order.getId() + ". Reason: " + reason);
            }
        } catch (Exception e) {
            System.err.println("Error handling payment failure: " + e.getMessage());
        }
    }
}