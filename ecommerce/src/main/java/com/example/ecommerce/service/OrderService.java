package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.dto.OrderItemDTO;
import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.dto.ProductMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductMapper productMapper; // converts Product → ProductDTO

    @Transactional
    public OrderDTO placeOrderFromCart(int cartId, List<Integer> cartItemIds) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create order entity
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(new Date());
        order.setStatus("PENDING");

        List<CartItem> itemsToOrder;
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            itemsToOrder = new ArrayList<>(cart.getItems());
        } else {
            itemsToOrder = cart.getItems().stream()
                    .filter(item -> cartItemIds.contains(item.getId()))
                    .collect(Collectors.toList());
        }

        if (itemsToOrder.isEmpty()) {
            throw new RuntimeException("No items selected for order");
        }

        // Convert CartItems → OrderItems
        List<OrderItem> orderItems = itemsToOrder.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        double total = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        order.setTotalPrice(total);

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Remove items from cart
        cart.getItems().removeAll(itemsToOrder);
        cartRepository.save(cart);

        // Convert to DTO
        OrderDTO dto = new OrderDTO();
        dto.setId(savedOrder.getId());
        dto.setUserId(savedOrder.getUser().getId());
        dto.setOrderDate(savedOrder.getOrderDate());
        dto.setStatus(savedOrder.getStatus());
        dto.setTotalPrice(savedOrder.getTotalPrice());

        List<OrderItemDTO> itemDTOs = savedOrder.getOrderItems().stream().map(oi -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(oi.getId());
            itemDTO.setQuantity(oi.getQuantity());
            itemDTO.setPrice(oi.getPrice());
            itemDTO.setProduct(productMapper.toDTO(oi.getProduct())); // use ProductDTO
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setOrderItems(itemDTOs);

        return dto;
    }
}



