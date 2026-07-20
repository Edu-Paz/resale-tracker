package com.resaletracker.financialapi.controllers.exceptions;

import com.resaletracker.financialapi.services.exceptions.BusinessException;
import com.resaletracker.financialapi.services.exceptions.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import org.springframework.dao.DataIntegrityViolationException;
import java.time.Instant;

@ControllerAdvice
public class ResourceExceptionHandler {

    /**
     * This method is triggered whenever a ResourceNotFoundException is thrown from any controller.
     * It builds a standardized error response with a 404 NOT_FOUND status.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request) {
        String error = "Resource not found";
        HttpStatus status = HttpStatus.NOT_FOUND; // 404
        StandardError err = new StandardError(Instant.now(), status.value(), error, e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    /**
     * This method is triggered whenever a BusinessException is thrown from any controller.
     * It builds a standardized error response with a 422 UNPROCESSABLE_ENTITY status.
     * This status is ideal for business rule violations (e.g., trying to sell an already sold item).
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<StandardError> businessException(BusinessException e, HttpServletRequest request) {
        String error = "Business rule violation";
        HttpStatus status = HttpStatus.valueOf(422); // 422
        StandardError err = new StandardError(Instant.now(), status.value(), error, e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    /**
     * This method is triggered whenever a DataIntegrityViolationException is thrown.
     * It builds a standardized error response with a 400 BAD_REQUEST status.
     * This is ideal for attempts to delete resources that are linked by foreign keys.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardError> database(DataIntegrityViolationException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        StandardError err = new StandardError(Instant.now(), status.value(), "Database integrity violation", e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }
}
