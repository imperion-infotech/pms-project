/**
 * 
 */
package com.pms.security.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.pms.security.service.CustomUserDetailsService;
import com.pms.security.util.filter.JwtAuthFilter;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {
	
	static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtAuthFilter jwtAuthFilter;
    
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,CustomUserDetailsService customUserDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.customUserDetailsService=customUserDetailsService;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/**").permitAll()
                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                    ).permitAll()
               
//              .requestMatchers("/user/getallotherchargedetails").permitAll()
//              .requestMatchers("/user/getotherchargedetails").permitAll()
//              .requestMatchers("/admin/createotherchargedetails").permitAll()
//              .requestMatchers("/admin/updateotherchargedetails").permitAll()
//              .requestMatchers("/admin/deleteotherchargedetails").permitAll()
                //.requestMatchers("/floor/**").hasRole("ADMIN")
                
//                .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
//                .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/admin/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
        
        
//        http
//        .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity (enable in production)
//        .authorizeHttpRequests(auth -> auth
//            .requestMatchers("/floor/**").hasRole("ADMIN") // Only ADMIN can access floor APIs
//            .anyRequest().authenticated()
//        )
//        .formLogin(form -> form.permitAll())
//        .logout(logout -> logout.permitAll())
//        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

//    return http.build();
}
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
    
//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//
//        authProvider.setUserDetailsService(customUserDetailsService);
//        authProvider.setPasswordEncoder(passwordEncoder());
//
//        return authProvider;
//    }
        
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
