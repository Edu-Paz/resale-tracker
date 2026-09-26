package com.resaletracker.financialapi.dtos.category;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryInsertDTO {
    @NotBlank(message = "Category name cannot be blank")
    private String name;
}