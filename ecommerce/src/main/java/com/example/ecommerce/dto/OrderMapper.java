package com.example.ecommerce.dto;

import org.springframework.stereotype.Component;
import com.example.ecommerce.dto.*;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    private final ProductMapper productMapper;

    public OrderMapper(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }

    public OrderItemDTO toDTO(OrderItem item) {
        return new OrderItemDTO(
                item.getId(),
                productMapper.toDTO(item.getProduct()),
                item.getQuantity(),
                item.getPrice()
        );
    }

    public OrderDTO toDTO(Order order) {
        List<OrderItemDTO> items = order.getOrderItems().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotalPrice(),
                items
        );
    }
}
