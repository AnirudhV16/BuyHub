package com.example.ecommerce.dto;

//DTO for status update request
public class OrderStatusUpdateRequest {
 private String status;

 public OrderStatusUpdateRequest() {}

 public OrderStatusUpdateRequest(String status) {
     this.status = status;
 }

 public String getStatus() {
     return status;
 }

 public void setStatus(String status) {
     this.status = status;
 }
}
