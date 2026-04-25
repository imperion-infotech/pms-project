package com.pms.security.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pms.security.entity.Permission;
import com.pms.security.entity.User;
import com.pms.security.repository.PermissionRepository;
import com.pms.security.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	
	static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

	@Autowired
    private UserRepository userRepository;
    private final Map<String, UserDetails> users = new HashMap<>();
    
    @Autowired
    private PermissionRepository permissionRepository;
    
 
    
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
    }
    
    
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
    }*/
    
   /* @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Set<GrantedAuthority> authorities = new HashSet<>();

        // Add role authority
        authorities.add(
//                new SimpleGrantedAuthority("ROLE_" + user.getRole().getName())
                new SimpleGrantedAuthority( user.getRole().getName())
        );

        // Super admin gets all permissions
        if ("ROLE_SUPER_ADMIN".equals(user.getRole().getName())) {

            permissionRepository.findAll().forEach(permission ->
                    authorities.add(
                            new SimpleGrantedAuthority(permission.getName())
                    )
            );

        } else {

            user.getRole().getPermissions().forEach(permission ->
                    authorities.add(
                            new SimpleGrantedAuthority(permission.getName())
                    )
            );
        }
        authorities.forEach(a -> System.out.println("AUTHORITY: " + a.getAuthority()));
        System.out.println("ROLE = " + user.getRole().getName());
//        return new org.springframework.security.core.userdetails.User(
//                user.getUsername(),
//                user.getPassword(),
//                authorities
//        );
        
        return new CustomUserDetails(user);
    }*/
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Set<Permission> permissions;

        if ("ROLE_SUPER_ADMIN".equals(user.getRole().getName())) {
            permissions = new HashSet<>(permissionRepository.findAll());
        } else {
            permissions = user.getRole().getPermissions();
        }

        List<GrantedAuthority> authorities = permissions.stream()
            .map(permission -> new SimpleGrantedAuthority(permission.getName()))
            .collect(Collectors.toList());

        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            authorities
        );
    }
    
    
}
