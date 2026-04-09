/**
 * 
 */
package com.pms.security.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pms.security.dto.RegisterRequest;
import com.pms.security.entity.Role;
import com.pms.security.entity.User;
import com.pms.security.repository.RoleRepository;
import com.pms.security.repository.UserRepository;
import com.pms.security.service.IUserService;

/**
 * 
 */
@Service
public class UserServiceImpl implements IUserService {
	
	  private final UserRepository userRepository ;
	  private final RoleRepository roleRepository;
	    private final PasswordEncoder passwordEncoder;
	
	 public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,RoleRepository roleRepository) {
	        this.userRepository = userRepository;
	        this.passwordEncoder = passwordEncoder;
	        this.roleRepository = roleRepository;
	    }

	    public User registerNewUser(RegisterRequest request) {
	        // Check if username already exists
	        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
	            throw new RuntimeException("Username already exists");
	        }

	        // Create new user with encrypted password
	        User user = new User();
	        user.setUsername(request.getUsername());
	        user.setPassword(passwordEncoder.encode(request.getPassword()));
	        user.setEnabled(true);
	        user.setEmail(request.getEmailId());
	        Set<Role> roles = new HashSet<>();
	        String roleName=request.getRole();
	            Role role = roleRepository.findByName(roleName)
	                .orElseThrow(() -> new RuntimeException("Role not found"));
	            roles.add(role);
	        user.setRoles(roles);
	        return userRepository.save(user);
	    }
}
