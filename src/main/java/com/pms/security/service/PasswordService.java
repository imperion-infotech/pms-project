/**
 * 
 */
package com.pms.security.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pms.security.entity.PasswordResetToken;
import com.pms.security.entity.User;
import com.pms.security.repository.PasswordResetTokenRepository;
import com.pms.security.repository.UserRepository;

/**
 * 
 */
@Service
public class PasswordService {

    @Autowired 
    private UserRepository userRepo;
    @Autowired 
    private PasswordResetTokenRepository tokenRepo;
    @Autowired 
    private final JavaMailSender mailSender;
    @Autowired 
    private PasswordEncoder passwordEncoder;
    @Autowired
    private Environment environment;
    
    public PasswordService(UserRepository userRepo, PasswordResetTokenRepository tokenRepo, JavaMailSender mailSender,
			PasswordEncoder passwordEncoder) {
		super();
		this.userRepo = userRepo;
		this.tokenRepo = tokenRepo;
		this.mailSender = mailSender;
		this.passwordEncoder = passwordEncoder;
	}

	public void createPasswordResetToken(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(60));
        tokenRepo.save(resetToken);
        
        String port = environment.getProperty("server.port");
        String ip=  environment.getProperty("password_reset_ip"); 
        
        StringBuilder resetLink=new StringBuilder("http://"+ip+":"+port);
        

        StringBuilder resetFullLink = resetLink.append("/auth/reset-password?token=" + token);
        sendEmail(email, "Password Reset", "Click here to reset: " + resetFullLink);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = userRepo.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        tokenRepo.delete(resetToken);
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}

