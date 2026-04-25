/**
 * 
 */
package com.pms.auditlog.filter;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pms.auditlog.context.BusinessTraceContext;
import com.pms.auditlog.context.RequestTraceContext;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 
 */
@Component
public class RequestTraceFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String traceId = UUID.randomUUID().toString();
            RequestTraceContext.set(traceId);

            filterChain.doFilter(request, response);

        } finally {
            RequestTraceContext.clear();
            BusinessTraceContext.clear();
        }
    }
}
