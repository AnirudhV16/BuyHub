package com.example.ecommerce.service;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.repository.OrderRepository;
import com.razorpay.RazorpayClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.commons.codec.binary.Hex;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // ✅ Create Razorpay Order and save mapping in DB
    public String createOrder(double amount, int dbOrderId) throws Exception {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int)(amount * 100)); // amount in paise (INR)
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        com.razorpay.Order razorpayOrder = razorpay.orders.create(options);

        // ✅ save mapping in DB
        Order order = orderRepository.findById(dbOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + dbOrderId));
        order.setRazorpayOrderId(razorpayOrder.get("id"));
        order.setStatus("CREATED");
        orderRepository.save(order);

        return razorpayOrder.toString(); // JSON response with Razorpay order_id
    }

    // ✅ Verify Payment Signature & Update DB
    public boolean verifyPayment(String razorpayOrderId, String paymentId, String signature) throws Exception {
        String data = razorpayOrderId + "|" + paymentId;
        String generatedSignature = HmacSHA256(data, razorpayKeySecret);

        if (generatedSignature.equals(signature)) {
            // ✅ Payment successful
            Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with razorpayOrderId: " + razorpayOrderId));

            order.setStatus("PAID");
            order.setRazorpayPaymentId(paymentId);
            orderRepository.save(order);

            return true;
        }
        return false;
    }

    private String HmacSHA256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(data.getBytes());
        return new String(Hex.encodeHex(hash));
    }
}
