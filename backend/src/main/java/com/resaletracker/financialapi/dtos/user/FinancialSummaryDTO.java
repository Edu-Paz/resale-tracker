package com.resaletracker.financialapi.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class FinancialSummaryDTO {
    private BigDecimal balance;
    private BigDecimal totalInvested;
    private BigDecimal totalPurchases;
    private BigDecimal totalExpenses;
    private BigDecimal totalSales;
    private BigDecimal totalProfit;
    private BigDecimal totalLoss;
    private BigDecimal averageMargin;
    private BigDecimal inventoryValue;
    private long totalItems;
    private long availableItems;
    private long soldItems;
}
