package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.CategoryDTO;
import com.resaletracker.financialapi.dtos.CategoryInsertDTO;
import com.resaletracker.financialapi.entities.Category;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.repositories.CategoryRepository;
import com.resaletracker.financialapi.services.exceptions.BusinessException;
import com.resaletracker.financialapi.services.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final AuthService authService;

    public CategoryService(CategoryRepository categoryRepository, AuthService authService) {
        this.categoryRepository = categoryRepository;
        this.authService = authService;
    }

    @Transactional
    public CategoryDTO createCategory(CategoryInsertDTO categoryInsertDTO) {
        User user = authService.getAuthenticatedUser();
        Category category = new Category();
        category.setName(categoryInsertDTO.getName());
        category.setUser(user);
        category = categoryRepository.save(category);
        return new CategoryDTO(category);
    }

    @Transactional
    public void deleteCategoryById(Long id) {
        User user = authService.getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id + " for the current user."));

        if (!category.getItems().isEmpty()) {
            throw new BusinessException("Cannot delete a category that contains items.");
        }

        categoryRepository.delete(category);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        User user = authService.getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id + " for the current user."));

        category.setName(categoryDTO.getName());
        category = categoryRepository.save(category);
        return new CategoryDTO(category);
    }
    
    @Transactional(readOnly = true)
    public List<CategoryDTO> findAllCategoriesByUser() {
        User user = authService.getAuthenticatedUser();
        List<Category> categories = categoryRepository.findAllByUserId(user.getId());
        return categories.stream().map(CategoryDTO::new).toList();
    }
}
