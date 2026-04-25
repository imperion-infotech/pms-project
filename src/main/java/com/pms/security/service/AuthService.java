/**
 * 
 */
package com.pms.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.pms.security.entity.User;
import com.pms.security.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * 
 */
@Service
@RequiredArgsConstructor
public class AuthService {
	
	@Autowired
	 private UserRepository userRepository ;

	    public User getCurrentUser() {

	        Authentication authentication = SecurityContextHolder
	                .getContext()
	                .getAuthentication();

	        String username = authentication.getName();

	        return userRepository.findByUsername(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));
	    }

}
