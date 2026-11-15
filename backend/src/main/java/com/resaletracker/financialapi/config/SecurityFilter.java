package com.resaletracker.financialapi.config;

import com.resaletracker.financialapi.repositories.UserRepository;
import com.resaletracker.financialapi.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(SecurityFilter.class);

    private final TokenService tokenService;
    private final UserRepository userRepository;

    public SecurityFilter(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("Processing request for URI: {}", request.getRequestURI());

        var token = this.recoverToken(request);
        log.info("Recovered token: {}", token != null ? "YES" : "NO");

        if (token != null) {
            boolean isTokenValid = tokenService.isTokenValid(token);
            log.info("Token validity: {}", isTokenValid);

            if (isTokenValid) {
                var username = tokenService.getUsernameFromToken(token);
                log.info("Username from token: {}", username);

                UserDetails user = userRepository.findByUsername(username);
                log.info("User found in repo: {}", user != null ? "YES" : "NO");

                if (user != null) {
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("SecurityContextHolder updated for user: {}", username);
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
