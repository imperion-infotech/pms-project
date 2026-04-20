/**
 * 
 */
package com.pms.security.util;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.pms.security.configuration.HotelContext;
import com.pms.security.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    private final long expirationMs = 3600000;

//    public String generateToken(User user) {
//        return Jwts.builder()
//                .setSubject(user.getUsername())
//                .claim("hotelId", user.getHotel().getId())
//                .claim("role", user.getRoles())
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
//                .signWith(getKey())
//                .compact();
//    }
    
    public String generateToken(User user, Long hotelId) {
    	 HotelContext.setHotelId(hotelId);
    	return Jwts.builder()
    	        .setSubject(user.getUsername())
    	        .claim("userId", user.getId())
    	        .claim("hotelId", hotelId)
    	        .claim("roles", user.getRoles())
    	        .setIssuedAt(new Date())
    	        .setExpiration(new Date(System.currentTimeMillis() + 86400000))
    	        .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // ✅ FIX
    	        .compact();
    }

    

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }
    
    public Long extractHotelId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("hotelId", Long.class);
    }
    
    private Claims extractAllClaims(String token) {
    	return Jwts.parserBuilder()
    	        .setSigningKey(getSigningKey())   // ✅ use Key object
    	        .build()
    	        .parseClaimsJws(token)
    	        .getBody();
    }
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    
}

