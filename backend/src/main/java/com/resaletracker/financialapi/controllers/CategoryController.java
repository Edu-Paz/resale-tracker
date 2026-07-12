package com.resaletracker.financialapi.controllers;

import com.resaletracker.financialapi.dtos.CategoryDTO;
import com.resaletracker.financialapi.dtos.CategoryInsertDTO;
import com.resaletracker.financialapi.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory (@Valid @RequestBody CategoryInsertDTO categoryInsertDTO){
        CategoryDTO newCategory = categoryService.createCategory(categoryInsertDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/categories/{id}")
                .buildAndExpand(newCategory.getId()).toUri();
        return ResponseEntity.created(uri).body(newCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryById (@PathVariable Long id, @RequestParam Long userId){
        // TODO: Replace @RequestParam with authenticated user from Spring Security context
        categoryService.deleteCategoryById(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory (@PathVariable Long id, @RequestParam Long userId, @RequestBody @Valid CategoryDTO categoryDTO){
        CategoryDTO updatedCategory = categoryService.updateCategory(id, userId, categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> findAllCategoriesByUser(@RequestParam Long userId){
        // TODO: Replace @RequestParam with authenticated user from Spring Security context
        List<CategoryDTO> categories = categoryService.findAllCategoriesByUser(userId);
        return ResponseEntity.ok(categories);
    }
}
