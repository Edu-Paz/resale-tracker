package com.resaletracker.financialapi.dtos;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.resaletracker.financialapi.entities.Expense;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "amount", "itemDTO"})
public class ExpenseDTO {
    private Long id;
    private String name;
    private BigDecimal amount;
    private ItemDTO itemDTO;

    public ExpenseDTO(Expense entity){
        this.id = entity.getId();
        this.name = entity.getName();
        this.amount = entity.getAmount();
        this.itemDTO = new ItemDTO(entity.getItem());
    }
}
