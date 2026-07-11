package com.resaletracker.financialapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Desabilita o CSRF, pois a API é stateless
            .csrf(csrf -> csrf.disable())
            
            // 2. Configura a política de sessão para stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 3. Configura as regras de autorização
            .authorizeHttpRequests(auth -> auth
                // Permite acesso irrestrito ao H2 Console
                .requestMatchers("/h2-console/**").permitAll()
                // Permite acesso irrestrito a todos os outros endpoints por enquanto
                .anyRequest().permitAll()
            )
            
            // 4. Necessário para o H2 console funcionar corretamente em conjunto com o Spring Security
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
