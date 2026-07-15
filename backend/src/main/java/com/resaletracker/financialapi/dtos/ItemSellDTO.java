package com.resaletracker.financialapi.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class ItemSellDTO {

    @NotNull(message = "Sell price is mandatory")
    @Positive(message = "Sell price must be positive")
    private BigDecimal sellPrice;

    @NotNull(message = "Sell date is mandatory")
    @PastOrPresent(message = "Sell date cannot be in the future")
    private LocalDate sellDate;
}
