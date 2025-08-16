package com.example.ecommerce.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CartItem> items = new ArrayList<>();


    // --- Utility Methods ---
    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }

    // --- Getters and Setters ---
    public Integer getId() { 
    	return id; 
    }
    public void setId(Integer id) { 
    	this.id = id; 
    }

    public User getUser() { 
    	return user; 
    }
    public void setUser(User user) { 
    	this.user = user; 
    }

    public List<CartItem> getItems() { 
    	return items; 
    }
    public void setItems(List<CartItem> items) { 
    	this.items = items; 
    }
}
