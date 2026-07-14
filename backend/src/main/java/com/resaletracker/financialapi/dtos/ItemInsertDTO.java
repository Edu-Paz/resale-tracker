package com.resaletracker.financialapi.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class ItemInsertDTO {

    @NotBlank(message = "Name is mandatory")
    private String name;

    private String imgUrl;

    @NotNull(message = "Buy price is mandatory")
    @Positive(message = "Buy price must be positive")
    private BigDecimal buyPrice;

    @NotNull(message = "Buy date is mandatory")
    @PastOrPresent(message = "Buy date cannot be in the future")
    private LocalDate buyDate;

    @NotNull(message = "Category ID is mandatory")
    private Long categoryId;
}
