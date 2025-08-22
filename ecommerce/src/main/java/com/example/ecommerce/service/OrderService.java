package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.dto.OrderItemDTO;
import com.example.ecommerce.dto.OrderStatsDTO;
import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.dto.ProductMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductMapper productMapper;

    // ✅ Existing method - Place order from cart
    @Transactional
    public OrderDTO placeOrderFromCart(int cartId, List<Integer> cartItemIds) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(new Date());
        order.setStatus("PENDING");

        List<CartItem> itemsToOrder;
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            itemsToOrder = new ArrayList<>(cart.getItems());
        } else {
            itemsToOrder = cart.getItems().stream()
                    .filter(item -> cartItemIds.contains(item.getId()))
                    .collect(Collectors.toList());
        }

        if (itemsToOrder.isEmpty()) {
            throw new RuntimeException("No items selected for order");
        }

        List<OrderItem> orderItems = itemsToOrder.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        double total = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        order.setTotalPrice(total);

        Order savedOrder = orderRepository.save(order);

        cart.getItems().removeAll(itemsToOrder);
        cartRepository.save(cart);

        return convertToDTO(savedOrder);
    }

    // ✅ NEW - Get all orders for admin
    public List<OrderDTO> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✅ NEW - Get orders by status
    public List<OrderDTO> getOrdersByStatus(String status) {
        List<Order> orders = orderRepository.findByStatusOrderByOrderDateDesc(status.toUpperCase());
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✅ NEW - Get order by ID for admin
    public OrderDTO getOrderByIdForAdmin(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    // ✅ NEW - Update order status
    @Transactional
    public OrderDTO updateOrderStatus(int orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Validate status
        if (!isValidOrderStatus(newStatus)) {
            throw new RuntimeException("Invalid order status: " + newStatus);
        }

        String oldStatus = order.getStatus();
        order.setStatus(newStatus.toUpperCase());
        
        // Update timestamp if needed
        if ("SHIPPED".equals(newStatus.toUpperCase()) || "DELIVERED".equals(newStatus.toUpperCase())) {
            order.setOrderDate(new Date()); // You might want a separate field for status update time
        }

        Order savedOrder = orderRepository.save(order);
        
        // Log the status change (optional)
        System.out.println("Order " + orderId + " status changed from " + oldStatus + " to " + newStatus);
        
        return convertToDTO(savedOrder);
    }

    // ✅ NEW - Get orders by user ID
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Order> orders = orderRepository.findByUserOrderByOrderDateDesc(user);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✅ NEW - Get order statistics
    public OrderStatsDTO getOrderStatistics() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus("PENDING");
        long paidOrders = orderRepository.countByStatus("PAID");
        long shippedOrders = orderRepository.countByStatus("SHIPPED");
        long deliveredOrders = orderRepository.countByStatus("DELIVERED");
        long cancelledOrders = orderRepository.countByStatus("CANCELLED");
        
        // Calculate total revenue from paid and delivered orders
        List<Order> completedOrders = orderRepository.findByStatusIn(List.of("PAID", "SHIPPED", "DELIVERED"));
        double totalRevenue = completedOrders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();

        // Calculate monthly revenue (current month)
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Date monthStart = Date.from(startOfMonth.atZone(ZoneId.systemDefault()).toInstant());
        
        List<Order> monthlyOrders = orderRepository.findByOrderDateAfterAndStatusIn(monthStart, List.of("PAID", "SHIPPED", "DELIVERED"));
        double monthlyRevenue = monthlyOrders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();

        return new OrderStatsDTO(totalOrders, pendingOrders, paidOrders, shippedOrders, 
                                deliveredOrders, cancelledOrders, totalRevenue, monthlyRevenue);
    }

    // ✅ Helper method - Convert Order to DTO
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalPrice(order.getTotalPrice());

        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(oi -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(oi.getId());
            itemDTO.setQuantity(oi.getQuantity());
            itemDTO.setPrice(oi.getPrice());
            itemDTO.setProduct(productMapper.toDTO(oi.getProduct()));
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setOrderItems(itemDTOs);
        return dto;
    }

    // ✅ Helper method - Validate order status
    private boolean isValidOrderStatus(String status) {
        List<String> validStatuses = List.of("PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED");
        return validStatuses.contains(status.toUpperCase());
    }
}