package com.example.ecommerce.dto;

import com.example.ecommerce.entity.Cart;
import java.util.List;
import java.util.stream.Collectors;

public class CartDTO {
    private int id;
    private long userId;
    private List<CartItemDTO> items;

    public CartDTO(Cart cart) {
        this.id = cart.getId();
        this.userId = cart.getUser().getId();
        this.items = cart.getItems().stream()
                         .map(CartItemDTO::new)
                         .collect(Collectors.toList());
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }
}
