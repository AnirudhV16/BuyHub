package com.example.ecommerce.controller;

import com.example.ecommerce.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ✅ Create Razorpay order and map to DB order
    @PostMapping("/create-order/{dbOrderId}/{amount}")
    public String createOrder(@PathVariable int dbOrderId, @PathVariable double amount) throws Exception {
        return paymentService.createOrder(amount, dbOrderId);
    }

    // ✅ Verify payment
    @PostMapping("/verify")
    public String verifyPayment(@RequestParam String razorpayOrderId,
                                @RequestParam String paymentId,
                                @RequestParam String signature) {
        try {
            boolean isValid = paymentService.verifyPayment(razorpayOrderId, paymentId, signature);
            if (isValid) {
                return "Payment verified successfully!";
            } else {
                return "Payment verification failed!";
            }
        } catch (Exception e) {
            return "Error verifying payment: " + e.getMessage();
        }
    }
}
