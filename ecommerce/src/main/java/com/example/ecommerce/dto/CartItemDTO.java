package com.example.ecommerce.dto;

import com.example.ecommerce.entity.CartItem;

    public class CartItemDTO {
        private int id;
        private int productId;
        private String productName;
        private String productDescription;
        private String productImageUrl;
        private double price;
        private int quantity;

        
    public CartItemDTO(CartItem item) {
        this.id = item.getId();
        this.productId = item.getProduct().getId();
        this.productName = item.getProduct().getName();
        this.productDescription = item.getProduct().getDescription();
        this.productImageUrl = item.getProduct().getImageUrl();
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
    
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

}

