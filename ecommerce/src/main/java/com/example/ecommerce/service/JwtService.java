package com.example.ecommerce.service;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import com.example.ecommerce.entity.User;

@Service
public class JwtService {
	
	private final SecretKey secretKey ;
	
	public JwtService() {
		this.secretKey = getKey();
	}
	
	public String generateToken(User user) {
		Map<String,Object> claims = new HashMap<>();
		// Add username as a claim
		claims.put("username", user.getUsername());
		
		// Debug: Print the role before adding to token
	    System.out.println("User role before token generation: " + user.getRole());
	    System.out.println("User role toString(): " + user.getRole().toString());
	    System.out.println("User role name(): " + user.getRole().name());
	    
		// Add role as a claim
		claims.put("authorities", user.getRole().name());
		
		return Jwts
				.builder()
				.setClaims(claims)
				.setSubject(user.getId().toString()) // Use user ID as subject
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis()+1000 * 60 * 60 * 1))
				.signWith(secretKey)
				.compact();
	}
	
	private SecretKey getKey() {
	    try {
	        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
	        SecretKey sk = keyGen.generateKey();
	        return sk; 
	    } catch (NoSuchAlgorithmException e) {
	        e.printStackTrace();
	        throw new RuntimeException("Failed to generate key", e);
	    } 
	}
	
	public boolean validateToken(String token, UserDetails userDetails) {
		final String userName = extractUsername(token);
		return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}
	
	private boolean isTokenExpired(String token) {
		return extractTokenExpiration(token).before(new Date());
	}
	
	private Date extractTokenExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}
	
	public String extractUsername(String token) {
		// Extract username from claims instead of subject
		return extractClaim(token, claims -> claims.get("username", String.class));
	}
	
	public String extractUserId(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	public String extractRole(String token) {
		return extractClaim(token, claims -> claims.get("authorities", String.class));
	}
	
	public <T> T extractClaim(String token, Function<Claims, T> claimResolver){
		final Claims claims = extractAllClaims(token);
		return claimResolver.apply(claims);
	}
	
	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build().parseClaimsJws(token).getBody();
	}
}