package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.CategoryDTO;
import com.resaletracker.financialapi.dtos.CategoryInsertDTO;
import com.resaletracker.financialapi.entities.Category;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.repositories.CategoryRepository;
import com.resaletracker.financialapi.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CategoryDTO createCategory(CategoryInsertDTO categoryInsertDTO) {
        User user = userRepository.findById(categoryInsertDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + categoryInsertDTO.getUserId()));

        Category category = new Category();
        category.setName(categoryInsertDTO.getName());
        category.setUser(user);

        category = categoryRepository.save(category);

        return new CategoryDTO(category);
    }

    @Transactional
    public void deleteCategoryById(Long id){

    }
}
