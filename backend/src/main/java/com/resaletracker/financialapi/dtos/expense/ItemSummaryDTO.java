package com.resaletracker.financialapi.dtos.expense;

import com.resaletracker.financialapi.entities.Item;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ItemSummaryDTO {
    private Long id;
    private String name;

    public ItemSummaryDTO(Item entity) {
        this.id = entity.getId();
        this.name = entity.getName();
    }
}
