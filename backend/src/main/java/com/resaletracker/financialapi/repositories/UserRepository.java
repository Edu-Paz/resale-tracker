package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    UserDetails findByUsername(String username);
}
