package com.example.ecommerce.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private AuthenticationManager authManager;
	
	@Autowired
	private JwtService jwtService;
	
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
	
	public User register(User user) {
		user.setPassword(encoder.encode(user.getPassword()));
		return userRepo.save(user);
	}
	
	public String verify(User user) {
		Authentication authentication = authManager.authenticate(
			new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
		);
		
		if (authentication.isAuthenticated()) {
			// Get the full user object from database
			User dbUser = userRepo.findByUsername(user.getUsername());
			if (dbUser != null) {
				// Pass the complete User object to generateToken
				return jwtService.generateToken(dbUser);
			}
		}
		return "Authentication failed";
	}
	
	// Add this method to help with cart functionality
	public User findByUsername(String username) {
		return userRepo.findByUsername(username);
	}
	
	// Add this method if you need it for other features
	public User findById(Long id) {
		return userRepo.findById(id).orElse(null);
	}
}