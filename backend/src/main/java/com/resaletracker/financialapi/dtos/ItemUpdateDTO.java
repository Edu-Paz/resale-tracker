package com.resaletracker.financialapi.dtos;

import com.resaletracker.financialapi.entities.ItemStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class ItemUpdateDTO {
    @NotBlank(message = "Name is mandatory")
    private String name;
    private String imgUrl;
    @Positive(message = "Buy price must be positive")
    private BigDecimal buyPrice;
    @PastOrPresent(message = "Buy date cannot be in the future")
    private LocalDate buyDate;
    private LocalDate sellDate;
    private BigDecimal sellPrice;
    private Long categoryId;
    private ItemStatus status;
}
