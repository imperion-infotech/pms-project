/**
 * 
 */
package com.pms.security.util.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;
import com.pms.security.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {
    	try {
    	   String header = request.getHeader("Authorization");

           String token = null;
           String username = null;
           Long userId = null;

           if (header != null && header.startsWith("Bearer ")) {
               token = header.substring(7);
               username = jwtUtil.extractUsername(token);
              
               
           }

           if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

               UserDetails userDetails = userDetailsService.loadUserByUsername(username);

               UsernamePasswordAuthenticationToken auth =
                       new UsernamePasswordAuthenticationToken(
                               userDetails,
                               null,
                               userDetails.getAuthorities()
                       );

               SecurityContextHolder.getContext().setAuthentication(auth);
           }
           
           // 🔥🔥 ADD THIS BLOCK (MOST IMPORTANT)
           if (token != null) {
               Long hotelId = jwtUtil.extractHotelId(token);
               HotelContext.setHotelId(hotelId);
               userId = jwtUtil.extractUserId(token);
               UserContext.setUserId(userId);
               
           }

           chain.doFilter(request, response);
       
    } finally {
    	
    	 HotelContext.clear();
    	 UserContext.clear();
    }
       // HotelContext.clear();
    }
    }
