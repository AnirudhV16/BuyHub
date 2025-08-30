package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
	
	Order findByRazorpayOrderId(String razorpayOrderId);
	
    // Find all orders ordered by date (newest first)
    List<Order> findAllByOrderByOrderDateDesc();

    // Find orders by status
    List<Order> findByStatusOrderByOrderDateDesc(String status);

    // Find orders by user
    List<Order> findByUserOrderByOrderDateDesc(User user);

    // Count orders by status
    long countByStatus(String status);

    // Find orders by status list (for revenue calculation)
    List<Order> findByStatusIn(List<String> statuses);

    // Find orders after a certain date with specific statuses
    List<Order> findByOrderDateAfterAndStatusIn(Date date, List<String> statuses);

    // Custom queries for advanced statistics
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= ?1")
    long countOrdersAfterDate(Date date);

    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status IN ?1")
    Double getTotalRevenueByStatuses(List<String> statuses);

    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.orderDate >= ?1 AND o.status IN ?2")
    Double getRevenueAfterDateByStatuses(Date date, List<String> statuses);

    // Find recent orders (last N orders)
    List<Order> findTop10ByOrderByOrderDateDesc();

    // Find orders by date range
    List<Order> findByOrderDateBetweenOrderByOrderDateDesc(Date startDate, Date endDate);

    // Find orders by user and status
    List<Order> findByUserAndStatusOrderByOrderDateDesc(User user, String status);
}

