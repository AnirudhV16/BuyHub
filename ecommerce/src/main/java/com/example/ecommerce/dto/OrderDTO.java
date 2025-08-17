package com.example.ecommerce.dto;

import java.util.Date;
import java.util.List;

public class OrderDTO {
    private int id;
    private Long userId;
    private Date orderDate;
    private String status;
    private double totalPrice;
    private List<OrderItemDTO> orderItems;
    
    

    public OrderDTO() {
		super();
	}
	public OrderDTO(int id, Long userId, Date orderDate, String status, double totalPrice,
			List<OrderItemDTO> orderItems) {
		super();
		this.id = id;
		this.userId = userId;
		this.orderDate = orderDate;
		this.status = status;
		this.totalPrice = totalPrice;
		this.orderItems = orderItems;
	}
	// Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Date getOrderDate() { return orderDate; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public List<OrderItemDTO> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDTO> orderItems) { this.orderItems = orderItems; }
}
