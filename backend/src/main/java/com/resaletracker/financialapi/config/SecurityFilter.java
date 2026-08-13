package com.resaletracker.financialapi.config;

import com.resaletracker.financialapi.repositories.UserRepository;
import com.resaletracker.financialapi.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("[SECURITY_FILTER] Processing request for URI: " + request.getRequestURI());

        var token = this.recoverToken(request);
        System.out.println("[SECURITY_FILTER] Recovered token: " + (token != null ? "YES" : "NO"));

        if (token != null) {
            boolean isTokenValid = tokenService.isTokenValid(token);
            System.out.println("[SECURITY_FILTER] Token validity: " + isTokenValid);

            if (isTokenValid) {
                var username = tokenService.getUsernameFromToken(token);
                System.out.println("[SECURITY_FILTER] Username from token: " + username);

                UserDetails user = userRepository.findByUsername(username);
                System.out.println("[SECURITY_FILTER] User found in repo: " + (user != null ? "YES" : "NO"));

                if (user != null) {
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("[SECURITY_FILTER] SecurityContextHolder updated for user: " + username);
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}
