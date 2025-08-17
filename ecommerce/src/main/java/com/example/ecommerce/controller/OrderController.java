package com.example.ecommerce.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Place order for full cart
    @PostMapping("/cart/{cartId}")
    public OrderDTO placeFullCartOrder(@PathVariable int cartId) {
        return orderService.placeOrderFromCart(cartId, null);
    }

    // ✅ Place order for selected cart items
    @PostMapping("/cart/{cartId}/items")
    public OrderDTO placePartialOrder(@PathVariable int cartId,
                                      @RequestBody List<Integer> selectedCartItemIds) {
        return orderService.placeOrderFromCart(cartId, selectedCartItemIds);
    }
}
