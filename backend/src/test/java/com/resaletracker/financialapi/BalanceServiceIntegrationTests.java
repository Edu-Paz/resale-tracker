package com.resaletracker.financialapi;

import com.resaletracker.financialapi.dtos.user.FinancialSummaryDTO;
import com.resaletracker.financialapi.services.BalanceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for the DB-side financial aggregation
 * ({@code ItemRepository.summarizeFinancialSummaryByUserId}).
 * <p>
 * Uses the {@code dev} profile (H2 + {@code import.sql} seed) so the query is
 * exercised against a real SQL engine, not mocked.
 */
@SpringBootTest
@ActiveProfiles("dev")
class BalanceServiceIntegrationTests {

    @Autowired
    private BalanceService balanceService;

    /**
     * john.doe (id=1) seed data:
     * - Used Laptop:  buy 1200.00 / sell 1450.00 / SOLD        -> profit 250.00
     * - Vintage T-Shirt: buy 25.50 / sell NULL / AVAILABLE     -> inventory 25.50
     */
    @Test
    void financialSummaryMatchesSeedDataForUserOne() {
        FinancialSummaryDTO summary = balanceService.calculateFinancialSummaryByUserId(1L);

        assertEquals(2L, summary.getTotalItems());
        assertEquals(1L, summary.getSoldItems());
        assertEquals(1L, summary.getAvailableItems());

        assertEquals(0, new BigDecimal("1225.50").compareTo(summary.getTotalPurchases()));
        assertEquals(0, new BigDecimal("0").compareTo(summary.getTotalExpenses()));
        assertEquals(0, new BigDecimal("1450.00").compareTo(summary.getTotalSales()));
        assertEquals(0, new BigDecimal("250.00").compareTo(summary.getTotalProfit()));
        assertEquals(0, new BigDecimal("0").compareTo(summary.getTotalLoss()));
        assertEquals(0, new BigDecimal("25.50").compareTo(summary.getInventoryValue()));
        assertEquals(0, new BigDecimal("224.50").compareTo(summary.getBalance()));
        assertEquals(0, new BigDecimal("1225.50").compareTo(summary.getTotalInvested()));
        assertEquals(0, new BigDecimal("17.24").compareTo(summary.getAverageMargin()));
    }

    /**
     * jane.smith (id=2) seed data:
     * - Limited Edition Runner: buy 150.00 / sell 225.00 / SOLD  -> profit 75.00
     * - Everyday Casual Shoes: buy 90.00 / sell NULL / AVAILABLE -> inventory 90.00
     */
    @Test
    void financialSummaryMatchesSeedDataForUserTwo() {
        FinancialSummaryDTO summary = balanceService.calculateFinancialSummaryByUserId(2L);

        assertEquals(2L, summary.getTotalItems());
        assertEquals(1L, summary.getSoldItems());
        assertEquals(1L, summary.getAvailableItems());

        assertEquals(0, new BigDecimal("240.00").compareTo(summary.getTotalPurchases()));
        assertEquals(0, new BigDecimal("225.00").compareTo(summary.getTotalSales()));
        assertEquals(0, new BigDecimal("75.00").compareTo(summary.getTotalProfit()));
        assertEquals(0, new BigDecimal("90.00").compareTo(summary.getInventoryValue()));
        assertEquals(0, new BigDecimal("-15.00").compareTo(summary.getBalance()));
        assertEquals(0, new BigDecimal("33.33").compareTo(summary.getAverageMargin()));
    }

    @Test
    void financialSummaryIsZeroedForUserWithoutItems() {
        FinancialSummaryDTO summary = balanceService.calculateFinancialSummaryByUserId(999L);

        assertEquals(0L, summary.getTotalItems());
        assertEquals(0L, summary.getSoldItems());
        assertEquals(0L, summary.getAvailableItems());
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getTotalPurchases()));
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getTotalExpenses()));
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getTotalSales()));
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getTotalProfit()));
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getTotalLoss()));
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getInventoryValue()));
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getBalance()));
        assertEquals(BigDecimal.ZERO, summary.getAverageMargin());
    }

    @Test
    void summaryIsScopedToTheRequestedUser() {
        FinancialSummaryDTO userOne = balanceService.calculateFinancialSummaryByUserId(1L);
        FinancialSummaryDTO userTwo = balanceService.calculateFinancialSummaryByUserId(2L);

        // No cross-user leakage: totals are scoped by category.user.id.
        assertNotEquals(0, userOne.getTotalSales().compareTo(userTwo.getTotalSales()));
    }
}
