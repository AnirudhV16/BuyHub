package com.example.ecommerce.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecommerce.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}

