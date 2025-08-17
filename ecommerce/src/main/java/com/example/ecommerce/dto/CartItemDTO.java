package com.example.ecommerce.dto;

import com.example.ecommerce.entity.CartItem;

public class CartItemDTO {
    private int id;
    private String productName;
    private double price;
    private int quantity;

    public CartItemDTO(CartItem item) {
        this.id = item.getId();
        this.productName = item.getProduct().getName(); // lazy loaded but accessed here
        this.price = item.getProduct().getPrice();
        this.quantity = item.getQuantity();
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}

