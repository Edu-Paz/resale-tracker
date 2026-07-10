package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
}
