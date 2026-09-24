package com.resaletracker.financialapi.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ExpenseUpdateDTO {
    @NotBlank(message = "Name is mandatory")
    private String name;

    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
}
