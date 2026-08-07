package com.resaletracker.financialapi.controllers;

import com.resaletracker.financialapi.dtos.UserDTO;
import com.resaletracker.financialapi.dtos.UserRegisterDTO;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<UserDTO> findById(@PathVariable Long id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Access Denied: User not authenticated.");
        }

        User authenticatedUser = (User) authentication.getPrincipal();

        if (authenticatedUser == null) {
            throw new AccessDeniedException("Access Denied: User principal not found.");
        }

        if (!authenticatedUser.getId().equals(id)) {
            throw new AccessDeniedException("Access Denied: You can only view your own user data.");
        }

        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping(value = "/me")
    public ResponseEntity<UserDTO> findMyDetails(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Access Denied: User not authenticated.");
        }
        User authenticatedUser = (User) authentication.getPrincipal();
        
        if (authenticatedUser == null) { // Adicionando a verificação de null
            throw new AccessDeniedException("Access Denied: User principal not found.");
        }

        return ResponseEntity.ok(userService.findById(authenticatedUser.getId()));
    }

    @PostMapping(value = "/register")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserRegisterDTO userRegisterDTO){
        UserDTO newUser = userService.registerUser(userRegisterDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/users/{id}")
                .buildAndExpand(newUser.getId()).toUri();
        return ResponseEntity.created(uri).body(newUser);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Access Denied: User not authenticated.");
        }
        User authenticatedUser = (User) authentication.getPrincipal();

        if (authenticatedUser == null) {
            throw new AccessDeniedException("Access Denied: User principal not found.");
        }

        if (!authenticatedUser.getId().equals(id)) {
            throw new AccessDeniedException("Access Denied: You can only delete your own user data.");
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
