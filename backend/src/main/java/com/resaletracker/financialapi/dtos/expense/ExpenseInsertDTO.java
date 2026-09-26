package com.resaletracker.financialapi.dtos.expense;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ExpenseInsertDTO {
    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Item id is mandatory")
    private Long itemId;
}
