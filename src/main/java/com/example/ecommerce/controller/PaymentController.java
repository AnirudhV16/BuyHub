package com.example.ecommerce.controller;

import com.example.ecommerce.dto.PaymentRequest;
import com.example.ecommerce.dto.PaymentResponse;
import com.example.ecommerce.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create Razorpay order and map to DB order
    @PostMapping("/create-order/{dbOrderId}/{amount}")
    public ResponseEntity<?> createOrder(@PathVariable int dbOrderId, @PathVariable double amount) {
        try {
            PaymentResponse response = paymentService.createOrder(amount, dbOrderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    // Verify payment
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentRequest request) {
        try {
            boolean isValid = paymentService.verifyPayment(
                    request.getRazorpayOrderId(),
                    request.getPaymentId(),
                    request.getSignature()
            );
            if (isValid) {
                return ResponseEntity.ok("Payment verified successfully!");
            } else {
                return ResponseEntity.badRequest().body("Payment verification failed!");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error verifying payment: " + e.getMessage());
        }
    }
}

