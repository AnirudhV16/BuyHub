package com.example.ecommerce.dto;

//DTO for order statistics
public class OrderStatsDTO {
 private long totalOrders;
 private long pendingOrders;
 private long paidOrders;
 private long shippedOrders;
 private long deliveredOrders;
 private long cancelledOrders;
 private double totalRevenue;
 private double monthlyRevenue;

 public OrderStatsDTO() {}

 public OrderStatsDTO(long totalOrders, long pendingOrders, long paidOrders, 
                     long shippedOrders, long deliveredOrders, long cancelledOrders,
                     double totalRevenue, double monthlyRevenue) {
     this.totalOrders = totalOrders;
     this.pendingOrders = pendingOrders;
     this.paidOrders = paidOrders;
     this.shippedOrders = shippedOrders;
     this.deliveredOrders = deliveredOrders;
     this.cancelledOrders = cancelledOrders;
     this.totalRevenue = totalRevenue;
     this.monthlyRevenue = monthlyRevenue;
 }

 // Getters and Setters
 public long getTotalOrders() { return totalOrders; }
 public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

 public long getPendingOrders() { return pendingOrders; }
 public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

 public long getPaidOrders() { return paidOrders; }
 public void setPaidOrders(long paidOrders) { this.paidOrders = paidOrders; }

 public long getShippedOrders() { return shippedOrders; }
 public void setShippedOrders(long shippedOrders) { this.shippedOrders = shippedOrders; }

 public long getDeliveredOrders() { return deliveredOrders; }
 public void setDeliveredOrders(long deliveredOrders) { this.deliveredOrders = deliveredOrders; }

 public long getCancelledOrders() { return cancelledOrders; }
 public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

 public double getTotalRevenue() { return totalRevenue; }
 public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

 public double getMonthlyRevenue() { return monthlyRevenue; }
 public void setMonthlyRevenue(double monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }
}