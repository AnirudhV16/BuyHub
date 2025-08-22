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

    // ✅ NEW - Get user's order history
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // ✅ NEW - Get specific order by ID (for user to view their own order)
    @GetMapping("/{orderId}/user/{userId}")
    public ResponseEntity<OrderDTO> getUserOrderById(@PathVariable int orderId, @PathVariable Long userId) {
        OrderDTO order = orderService.getOrderByIdForAdmin(orderId);
        
        // Check if the order belongs to the requesting user
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: Order does not belong to user");
        }
        
        return ResponseEntity.ok(order);
    }

    // ✅ NEW - Get user's orders by status
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<OrderDTO>> getUserOrdersByStatus(@PathVariable Long userId, @PathVariable String status) {
        List<OrderDTO> userOrders = orderService.getOrdersByUserId(userId);
        
        List<OrderDTO> filteredOrders = userOrders.stream()
                .filter(order -> order.getStatus().equalsIgnoreCase(status))
                .toList();
        
        return ResponseEntity.ok(filteredOrders);
    }
}