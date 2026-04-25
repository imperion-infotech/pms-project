/**
 * 
 */
package com.pms.security.util;

/**
 * 
 */
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return "SYSTEM";
        }
        System.out.println("Authorities = " + auth.getAuthorities());

        return auth.getName(); // email/username
    }
}