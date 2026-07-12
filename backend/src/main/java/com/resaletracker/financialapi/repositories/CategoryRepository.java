package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Long deleteByIdAndUserId(Long id, Long userId);

    Optional<Category> findByIdAndUserId(Long id, Long userId);

    List<Category> findAllByUserId(Long userId);
}
