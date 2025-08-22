package com.example.ecommerce.controller;


import com.example.ecommerce.entity.User;
import com.example.ecommerce.service.UserService;

import java.util.Map;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	private UserService userService;

	@PostMapping("/user/register")
	public User register(@RequestBody User user) {
		return userService.register(user);
	}
	
	@PostMapping("/user/login")
	public String login(@RequestBody User user) {
		String token = userService.verify(user);
		return token;
	}
	
	@GetMapping("/user/")
	public String home(){
		return "welcome home :)";
	}
}