package com.example.ecommerce.dto;

public class PaymentResponse {
    private String orderId;
    private int amount;
    private String currency;
    private String razorpayKeyId;
    
	public PaymentResponse() {
		super();
	}
	public PaymentResponse(String orderId, int amount, String currency, String razorpayKeyId) {
		super();
		this.orderId = orderId;
		this.amount = amount;
		this.currency = currency;
		this.razorpayKeyId = razorpayKeyId;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public String getRazorpayKeyId() {
		return razorpayKeyId;
	}
	public void setRazorpayKeyId(String razorpayKeyId) {
		this.razorpayKeyId = razorpayKeyId;
	}
}

