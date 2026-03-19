package com.pms.security.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pms.security.entity.User;
import com.pms.security.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final Map<String, UserDetails> users = new HashMap<>();
    
 
    
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
		// Admin user
        users.put("admin", org.springframework.security.core.userdetails.User.withUsername("admin")
                .password("{noop}password") // {noop} means no encoding (for demo only)
                .roles("ADMIN") // becomes ROLE_ADMIN internally
                .build());

        // Normal user
        users.put("user", org.springframework.security.core.userdetails.User.withUsername("user")
                .password("{noop}12345")
                .roles("USER") // becomes ROLE_USER internally
                .build());
    }

    

    /*@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword()) // must be encoded in DB
                .authorities(Collections.emptyList()) // map roles if needed
                .build();
    }*/
    
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword()) // Must be BCrypt encoded in DB
                .authorities(
                        user.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority(role.getName())) // e.g., ROLE_ADMIN
                                .collect(Collectors.toList())
                )
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isEnabled())
                .build();
    }
    
    
}
