/**
 * 
 */
package com.pms.security.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 */
@RestController
public class DemoController {

    @GetMapping("/")
    public String home() {
        return "Welcome to the public page!";
    }

    @GetMapping("/user/dashboard")
    public String userDashboard() {
        return "Hello User!";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "Hello Admin!";
    }
}
