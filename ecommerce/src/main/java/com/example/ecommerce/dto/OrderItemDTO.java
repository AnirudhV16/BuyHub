package com.example.ecommerce.dto;

import com.example.ecommerce.dto.ProductDTO;

public class OrderItemDTO {
    private int id;
    private ProductDTO product;
    private int quantity;
    private double price;
    
    public OrderItemDTO() {
		super();
	}

	public OrderItemDTO(int id, ProductDTO product, int quantity, double price) {
		super();
		this.id = id;
		this.product = product;
		this.quantity = quantity;
		this.price = price;
	}
    
    
    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public ProductDTO getProduct() { return product; }
    public void setProduct(ProductDTO product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}

