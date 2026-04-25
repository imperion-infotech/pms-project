/**
 * 
 */
package com.pms.security.service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.pms.security.entity.User;
import com.pms.security.repository.PermissionRepository;

/**
 * 
 */
public class CustomUserDetails implements UserDetails {

    private final User user;
    

    public CustomUserDetails(User user) {
        this.user = user;
    }

    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        if ("SUPER_ADMIN".equals(user.getRole().getName())) {
        	 return user.getRole().getPermissions().stream()
                     .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                     .collect(Collectors.toList());
        }
        return user.getRole().getPermissions().stream()
            .map(permission -> new SimpleGrantedAuthority(permission.getName()))
            .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public User getUser() {
        return user;
    }
}
