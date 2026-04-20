package com.pms.auditlog.util;


import org.slf4j.MDC;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pms.security.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


public class AuditUtil {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static String toJson(Object obj) {
        try {
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "ERROR";
        }
    }

    public static String getUsername() {
    	
    	User user =(User) AuditUtil.getSessionAttribute("user");
    	if(user != null) {
    	return user.getUsername();
    	} else
    	{
    		return "";
    	}
    
    }

    public static String getTraceId() {
        return MDC.get("traceId");
    }
    
 // Get session attribute by name
    public static Object getSessionAttribute(String name) {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes servletRequestAttributes) {
            HttpServletRequest request = servletRequestAttributes.getRequest();
            HttpSession session = request.getSession(false); // false = don't create new session
            if (session != null) {
                return session.getAttribute(name);
            }
        }
        return null;
    }
    
 // Remove session attribute by name
    public static void removeSessionAttribute(String name) {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes servletRequestAttributes) {
            HttpServletRequest request = servletRequestAttributes.getRequest();
            HttpSession session = request.getSession(false); // false = don't create new session
            if (session != null) {
                session.removeAttribute(name);
            }
        }
    }
}