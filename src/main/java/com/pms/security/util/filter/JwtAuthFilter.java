/**
 * 
 */
package com.pms.security.util.filter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;
import com.pms.security.service.RolePermissionCacheService;
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
    private RolePermissionCacheService rolePermissionCacheService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        try {

            String path = request.getServletPath();

            // Skip public APIs
            if (path.startsWith("/auth/")
                    || path.startsWith("/api/role-permissions/")
                    || path.startsWith("/swagger-ui/")
                    || path.startsWith("/v3/api-docs/")
                    || path.equals("/swagger-ui.html")) {

                chain.doFilter(request, response);
                return;
            }

            String header = request.getHeader("Authorization");

            if (header == null || !header.startsWith("Bearer ")) {
                chain.doFilter(request, response);
                return;
            }

            String token = header.substring(7);

            String username = jwtUtil.extractUsername(token);
            Long userId = jwtUtil.extractUserId(token);
            Long hotelId = jwtUtil.extractHotelId(token);
            List<Long> roleIds = jwtUtil.extractRoleIds(token);
            List<String> roles = jwtUtil.extractRoles(token);

            if (roleIds == null || roleIds.isEmpty()) {
                chain.doFilter(request, response);
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

            	Collection<? extends GrantedAuthority> authorities;

            	if (roleIds != null && roleIds.contains(3L)) {
            	    authorities = rolePermissionCacheService.getAllAuthorities();
            	    System.out.println("Logged in user: " + username);
                    System.out.println("Authorities: " + authorities);

            	} else {
            	    authorities = rolePermissionCacheService.getAuthoritiesByRoleIds(roleIds);
            	}

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);
            }

            HotelContext.setHotelId(hotelId);
            UserContext.setUserId(userId);
            
            
            chain.doFilter(request, response);

        } finally {
            HotelContext.clear();
            UserContext.clear();
        }
    }
    
}
