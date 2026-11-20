package com.resaletracker.financialapi.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * Raw financial aggregates computed on the database side by a single JPQL
 * aggregate query (see {@code ItemRepository.summarizeFinancialSummaryByUserId}).
 * <p>
 * This projection intentionally carries only the primitive sums/counts that the
 * database can produce with {@code SUM}/{@code COALESCE}/{@code CASE WHEN}.
 * Derived metrics that require explicit rounding (balance, average margin) are
 * resolved in the service layer to keep a single, testable rounding policy
 * ({@code RoundingMode.HALF_UP}).
 */
@Getter
@AllArgsConstructor
public class FinancialSummaryProjectionDTO {
    private final Long totalItems;
    private final BigDecimal totalPurchases;
    private final BigDecimal totalExpenses;
    private final BigDecimal totalSales;
    private final BigDecimal totalProfit;
    private final BigDecimal totalLoss;
    private final BigDecimal inventoryValue;
    private final Long soldItems;
    private final Long availableItems;
}
