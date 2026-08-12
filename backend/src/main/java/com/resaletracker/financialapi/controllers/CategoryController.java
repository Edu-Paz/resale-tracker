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
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryInsertDTO categoryInsertDTO) {
        CategoryDTO newCategory = categoryService.createCategory(categoryInsertDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/categories/{id}")
                .buildAndExpand(newCategory.getId()).toUri();
        return ResponseEntity.created(uri).body(newCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryById(@PathVariable Long id) {
        categoryService.deleteCategoryById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryDTO categoryDTO) {
        CategoryDTO updatedCategory = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> findAllCategoriesByUser() {
        List<CategoryDTO> categories = categoryService.findAllCategoriesByUser();
        return ResponseEntity.ok(categories);
    }
}
