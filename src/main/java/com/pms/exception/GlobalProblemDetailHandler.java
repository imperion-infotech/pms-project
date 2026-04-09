/**
 * 
 */
package com.pms.exception;

/**
 * 
 */

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.concurrent.ConcurrentHashMap;

@ControllerAdvice
public class GlobalProblemDetailHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalProblemDetailHandler.class);

    // Map custom exceptions to HTTP status codes
    private static final Map<Class<? extends Throwable>, HttpStatus> EXCEPTION_STATUS_MAP = new ConcurrentHashMap<>();
    static {
        EXCEPTION_STATUS_MAP.put(ResourceNotFoundException.class, HttpStatus.NOT_FOUND);
        EXCEPTION_STATUS_MAP.put(BusinessException.class, HttpStatus.BAD_REQUEST);
        // Add more mappings as needed
    }

    /**
     * Handle validation errors automatically
     */
    @Override
    protected org.springframework.http.ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        String correlationId = UUID.randomUUID().toString();

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Validation failed for one or more fields"
        );
        problemDetail.setTitle("Validation Error");
        problemDetail.setType(URI.create("https://api.example.com/errors/validation-error"));
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("errors", errors);
        problemDetail.setProperty("errorCount", errors.size());
        problemDetail.setProperty("correlationId", correlationId);

        // Log with correlation ID
        log.warn("[{}] Validation error: {}", correlationId, errors);

        return new org.springframework.http.ResponseEntity<>(problemDetail, headers, status);
    }

    /**
     * Handle all other exceptions, including custom domain exceptions
     */
    @Override
    protected org.springframework.http.ResponseEntity<Object> handleExceptionInternal(
            Exception ex,
            Object body,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        String correlationId = UUID.randomUUID().toString();

        // Determine HTTP status
        HttpStatus resolvedStatus = EXCEPTION_STATUS_MAP.getOrDefault(ex.getClass(),
                status instanceof HttpStatus ? (HttpStatus) status : HttpStatus.INTERNAL_SERVER_ERROR);

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                resolvedStatus,
                ex.getMessage() != null ? ex.getMessage() : "Unexpected error occurred"
        );

        if (resolvedStatus.is4xxClientError()) {
            problemDetail.setTitle("Client Error");
        } else if (resolvedStatus.is5xxServerError()) {
            problemDetail.setTitle("Server Error");
        }

        problemDetail.setType(URI.create("https://api.example.com/errors/" + resolvedStatus.value()));
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("exception", ex.getClass().getSimpleName());
        problemDetail.setProperty("correlationId", correlationId);

        // Log with correlation ID
        if (resolvedStatus.is5xxServerError()) {
            log.error("[{}] Server error occurred", correlationId, ex);
        } else {
            log.warn("[{}] Client error: {}", correlationId, ex.getMessage());
        }

        return new org.springframework.http.ResponseEntity<>(problemDetail, headers, resolvedStatus);
    }
}
