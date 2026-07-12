package com.resaletracker.financialapi.dtos;

import com.resaletracker.financialapi.entities.Category;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private UserDTO user;

    public CategoryDTO(Category entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.user = new UserDTO(entity.getUser());
    }
}
