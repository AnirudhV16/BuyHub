package com.example.ecommerce.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.dto.OrderStatsDTO;
import com.example.ecommerce.dto.OrderStatusUpdateRequest;
import com.example.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    //  Get all orders (Admin only)
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(orders);
    }

    //  Get orders by status (Admin only)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable String status) {
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    //  Get order by ID (Admin only)
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable int orderId) {
        OrderDTO order = orderService.getOrderByIdForAdmin(orderId);
        return ResponseEntity.ok(order);
    }

    //  Update order status (Admin only)
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable int orderId,
            @RequestBody OrderStatusUpdateRequest request) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, request.getStatus());
        return ResponseEntity.ok(updatedOrder);
    }

    //  Get orders by user ID (Admin only)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    //  Get order statistics (Admin only)
    @GetMapping("/stats")
    public ResponseEntity<OrderStatsDTO> getOrderStats() {
        OrderStatsDTO stats = orderService.getOrderStatistics();
        return ResponseEntity.ok(stats);
    }
}
