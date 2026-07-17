package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.CategoryDTO;
import com.resaletracker.financialapi.dtos.CategoryInsertDTO;
import com.resaletracker.financialapi.entities.Category;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.repositories.CategoryRepository;
import com.resaletracker.financialapi.repositories.UserRepository;
import com.resaletracker.financialapi.services.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + categoryInsertDTO.getUserId()));

        Category category = new Category();
        category.setName(categoryInsertDTO.getName());
        category.setUser(user);

        category = categoryRepository.save(category);

        return new CategoryDTO(category);
    }

    @Transactional
    public void deleteCategoryById(Long id, Long userId){
        Long deletedCount = categoryRepository.deleteByIdAndUserId(id, userId);
        if (deletedCount == 0) {
            throw new ResourceNotFoundException("Category not found with id: " + id + " for the specified user.");
        }
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, Long userId, CategoryDTO categoryDTO){
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id + " for the specified user."));

        category.setName(categoryDTO.getName());
        category = categoryRepository.save(category);
        return new CategoryDTO(category);
    }
    
    @Transactional(readOnly = true)
    public List<CategoryDTO> findAllCategoriesByUser(Long userId){
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Category> categories = categoryRepository.findAllByUserId(userId);
        return categories.stream().map(CategoryDTO::new).toList();
    }
}
