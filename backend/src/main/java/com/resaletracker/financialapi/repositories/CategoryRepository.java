package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
