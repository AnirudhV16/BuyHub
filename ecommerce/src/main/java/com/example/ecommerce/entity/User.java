package com.example.ecommerce.entity;

import jakarta.persistence.*;

//User.java
@Entity
public class User {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String username;

 private String email;
 
 private String password;

 @Enumerated(EnumType.STRING)
 private Role role;

 private boolean enabled = true;

 public User() {
 }
 
 public User(String username, String email, String password, Role role, boolean enabled) {
	this.username = username;
	this.email = email;
	this.password = password;
	this.role = role;
	this.enabled = enabled;
}

 public Long getId() {
	return id;
}

 public void setId(Long id) {
	this.id = id;
 }

 public String getUsername() {
	return username;
 }

 public void setUsername(String username) {
	this.username = username;
 }

 public String getEmail() {
	return email;
 }

 public void setEmail(String email) {
	this.email = email;
 }

 public String getPassword() {
	return password;
 }

 public void setPassword(String password) {
	this.password = password;
 }

 public Role getRole() {
	return role;
 }

 public void setRole(Role role) {
	this.role = role;
 }

 public boolean isEnabled() {
	return enabled;
 }

 public void setEnabled(boolean enabled) {
	this.enabled = enabled;
 }

}
