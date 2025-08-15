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

@Service
public class JwtService {
	
	private final SecretKey secretKey ;
	
	public JwtService() {
		this.secretKey = getKey();
	}

	public String generateToken(String username) {
		Map<String,Object> claims = new HashMap<>();
		return Jwts
				.builder()
				.setClaims(claims)
				.setSubject(username)
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
		// TODO Auto-generated method stub
		final String userName = extractUsername(token);
		return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
		
	}

	private boolean isTokenExpired(String token) {
		// TODO Auto-generated method stub
		return extractTokenExpiration(token).before(new Date());
	}

	private Date extractTokenExpiration(String token) {
		// TODO Auto-generated method stub
		return extractClaim(token, Claims::getExpiration);
	}

	public String extractUsername(String token) {
		// TODO Auto-generated method stub
		return extractClaim(token,Claims::getSubject);
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
