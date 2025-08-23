package com.example.ecommerce.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Place order for full cart (existing)
    @PostMapping("/cart/{cartId}")
    public OrderDTO placeFullCartOrder(@PathVariable int cartId) {
        return orderService.placeOrderFromCart(cartId, null);
    }

    // ✅ Place order for selected cart items (existing)
    @PostMapping("/cart/{cartId}/items")
    public OrderDTO placePartialOrder(@PathVariable int cartId,
                                      @RequestBody List<Integer> selectedCartItemIds) {
        return orderService.placeOrderFromCart(cartId, selectedCartItemIds);
    }

    // ✅ Get user's order history
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // ✅ Get specific order by ID (for user to view their own order)
    @GetMapping("/{orderId}/user/{userId}")
    public ResponseEntity<OrderDTO> getUserOrderById(@PathVariable int orderId, @PathVariable Long userId) {
        try {
            OrderDTO order = orderService.getOrderByIdForUser(orderId, userId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ✅ NEW - Get order details for checkout (user must own the order)
    @GetMapping("/{orderId}/checkout")
    public ResponseEntity<OrderDTO> getOrderForCheckout(@PathVariable int orderId) {
        try {
            // This will be secured by Spring Security to ensure only the order owner can access
            OrderDTO order = orderService.getOrderByIdForAdmin(orderId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Get user's orders by status
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<OrderDTO>> getUserOrdersByStatus(@PathVariable Long userId, @PathVariable String status) {
        List<OrderDTO> userOrders = orderService.getOrdersByUserId(userId);
        
        List<OrderDTO> filteredOrders = userOrders.stream()
                .filter(order -> order.getStatus().equalsIgnoreCase(status))
                .toList();
        
        return ResponseEntity.ok(filteredOrders);
    }
    
    // ✅ Cancel order (user can only cancel their own order if still PENDING/PROCESSING)
    @PutMapping("/{orderId}/user/{userId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(
            @PathVariable int orderId,
            @PathVariable Long userId) {
        try {
            OrderDTO cancelledOrder = orderService.cancelOrder(orderId, userId);
            return ResponseEntity.ok(cancelledOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}