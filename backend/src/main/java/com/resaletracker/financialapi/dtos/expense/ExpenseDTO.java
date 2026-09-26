package com.resaletracker.financialapi.dtos.expense;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.resaletracker.financialapi.entities.Expense;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "amount", "item"})
public class ExpenseDTO {
    private Long id;
    private String name;
    private BigDecimal amount;
    private ItemSummaryDTO item;

    public ExpenseDTO(Expense entity){
        this.id = entity.getId();
        this.name = entity.getName();
        this.amount = entity.getAmount();
        this.item = new ItemSummaryDTO(entity.getItem());
    }
}
