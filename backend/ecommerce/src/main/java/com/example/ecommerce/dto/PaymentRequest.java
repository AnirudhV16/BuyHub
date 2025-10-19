package com.example.ecommerce.dto;

public class PaymentRequest {
    private String razorpayOrderId;
    private String paymentId;
    private String signature;
    
	public PaymentRequest() {
		super();
	}
	public PaymentRequest(String razorpayOrderId, String paymentId, String signature) {
		super();
		this.razorpayOrderId = razorpayOrderId;
		this.paymentId = paymentId;
		this.signature = signature;
	}
	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}
	public void setRazorpayOrderId(String razorpayOrderId) {
		this.razorpayOrderId = razorpayOrderId;
	}
	public String getPaymentId() {
		return paymentId;
	}
	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}
	public String getSignature() {
		return signature;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
}
