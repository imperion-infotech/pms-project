/**
 * 
 */
/**
 * 
 */
package com.pms.security.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pms.hotel.repository.UserHotelMappingRepository;
import com.pms.security.dto.AuthResponse;
import com.pms.security.dto.LoginRequest;
import com.pms.security.dto.LoginResponse;
import com.pms.security.dto.RefreshRequest;
import com.pms.security.dto.RegisterRequest;
import com.pms.security.entity.RefreshToken;
import com.pms.security.entity.User;
import com.pms.security.repository.UserRepository;
import com.pms.security.service.IUserService;
import com.pms.security.service.PasswordService;
import com.pms.security.service.RefreshTokenService;
import com.pms.security.service.TokenBlacklistService;
import com.pms.security.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import com.pms.security.entity.UserHotelMapping;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.pms.security.dto.HotelDTO;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

	static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	private final IUserService userService;
	private final TokenBlacklistService blacklistService;
	private final UserRepository userRepository;
	@Autowired
    private RefreshTokenService refreshTokenService;
	 @Autowired private PasswordService passwordService;
	 @Autowired
    private UserHotelMappingRepository mappingRepository;
	 
	 

	public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, IUserService userService,
			TokenBlacklistService blacklistService,UserRepository userRepository) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		this.userService = userService;
		this.blacklistService = blacklistService;
		this.userRepository=userRepository;
	}

//	@PostMapping("/login")
//	public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password, HttpSession httpSession) {
//		try {
//			Authentication authentication = authenticationManager
//					.authenticate(new UsernamePasswordAuthenticationToken(username, password));
//			User user = userRepository.findByUsername(username)
//			        .orElseThrow(() -> new RuntimeException("User not found"));
//			
//			 httpSession.setAttribute("user", user);
//			 RefreshToken refreshToken = refreshTokenService.createToken(user);
//			 return ResponseEntity.ok(
//		                new AuthResponse(jwtUtil.generateToken(user), refreshToken.getToken())
//		        );
//			 
//		} catch (AuthenticationException e) {
//			throw new RuntimeException("Invalid username or password");
//		}
//	}
	
	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest request, HttpSession httpSession) {
		try {
	    Authentication authentication = authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(
	                    request.username,
	                    request.password
	            )
	    );
		} catch (Exception e) {
		    e.printStackTrace();
		    throw e;
		}

	    User user = userRepository.findByUsername(request.username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    httpSession.setAttribute("user", user);

	    List<UserHotelMapping> mappings = mappingRepository.findByUserId(user.getId());

	    List<HotelDTO> hotels = mappings.stream()
	            .map(m -> new HotelDTO(
	                    m.getHotel().getId(),
	                    m.getHotel().getHotelName()))
	            .toList();

	    String token = jwtUtil.generateToken(user, null);

	    RefreshToken refreshToken = refreshTokenService.createToken(user);

	    LoginResponse response = new LoginResponse();
	    response.setToken(token);
	    response.setHotels(hotels);
	    response.setRefreshToken(refreshToken.getToken());

	    return response;
	}
	
	@PostMapping("/select-hotel")
	public String selectHotel(@RequestParam Long hotelId,
	                         @RequestParam String username) {

	    User user = userRepository.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    boolean valid = mappingRepository
	            .existsByUserIdAndHotelId(user.getId(), hotelId);

	    if (!valid) {
	        throw new RuntimeException("Unauthorized hotel access");
	    }

	    UserHotelMapping mapping = mappingRepository.findByUserId(user.getId())
	            .stream()
	            .filter(m -> m.getHotel().getId().equals(hotelId))
	            .findFirst()
	            .get();

	    // 🔥 token WITH hotelId
	    return jwtUtil.generateToken(user, hotelId);
	}
	

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
		try {
			User savedUser = userService.registerNewUser(request);
			return ResponseEntity.ok("User registered successfully with ID: " + savedUser.getId());
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) {
		boolean loggedOut = false;

		// 1️⃣ Handle JWT logout
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			blacklistService.blacklistToken(token);
			loggedOut = true;
		}

		// 2️⃣ Handle session logout
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
			loggedOut = true;
		}

		if (loggedOut) {
			return ResponseEntity.ok("Logged out successfully.");
		} else {
			return ResponseEntity.badRequest().body("No active session or token found.");
		}
	}
	
	// 🔄 REFRESH TOKEN API
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest request) {

        RefreshToken refreshToken = refreshTokenService.validateToken(request.refreshToken);
        Long hotelId=1L;
        
        String newAccessToken = jwtUtil.generateToken(
                refreshToken.getUser(),hotelId
        );

        return ResponseEntity.ok(
                new AuthResponse(newAccessToken, request.refreshToken)
        );
    }
    
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        passwordService.createPasswordResetToken(email);
        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token,
                                                @RequestParam String newPassword) {
        passwordService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password updated successfully.");
    }
    
    
}
