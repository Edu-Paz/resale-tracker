package com.resaletracker.financialapi.controllers;

import com.resaletracker.financialapi.dtos.LoginRequestDTO;
import com.resaletracker.financialapi.dtos.LoginResponseDTO;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        logger.info("Login attempt for user: {}", loginRequest.getUsername());

        UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

        try {
            Authentication auth = authenticationManager.authenticate(usernamePassword);
            logger.info("Authentication successful for user: {}", loginRequest.getUsername());

            String token = tokenService.generateToken((User) auth.getPrincipal());
            return ResponseEntity.ok(new LoginResponseDTO(token));

        } catch (AuthenticationException e) {
            logger.warn("Authentication failed for user: {}. Reason: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(403).body("Authentication failed: " + e.getMessage());
        }
    }
}
