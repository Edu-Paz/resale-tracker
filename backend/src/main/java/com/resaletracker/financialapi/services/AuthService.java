package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.entities.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public User getAuthenticatedUser() {
        try {
            return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            throw new IllegalStateException("Could not retrieve authenticated user. Make sure the user is authenticated.", e);
        }
    }
}
