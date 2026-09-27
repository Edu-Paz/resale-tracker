package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.entities.ItemStatus;
import com.resaletracker.financialapi.repositories.ItemRepository;
import com.resaletracker.financialapi.dtos.user.FinancialSummaryDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class BalanceService {
    private final ItemRepository itemRepository;

    public BalanceService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateByUserId(Long userId) {
        return calculateFinancialSummaryByUserId(userId).getBalance();
    }

    @Transactional(readOnly = true)
    public FinancialSummaryDTO calculateFinancialSummaryByUserId(Long userId) {
        var items = itemRepository.findAllByCategory_UserId(userId);
        BigDecimal totalPurchases = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        BigDecimal totalSales = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        BigDecimal totalLoss = BigDecimal.ZERO;
        BigDecimal inventoryValue = BigDecimal.ZERO;
        long availableItems = 0;
        long soldItems = 0;

        for (Item item : items) {
            BigDecimal purchase = valueOrZero(item.getBuyPrice());
            BigDecimal expenses = item.getExpense().stream()
                    .map(expense -> valueOrZero(expense.getAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            totalPurchases = totalPurchases.add(purchase);
            totalExpenses = totalExpenses.add(expenses);

            if (item.getStatus() == ItemStatus.SOLD && item.getSellPrice() != null) {
                soldItems++;
                totalSales = totalSales.add(item.getSellPrice());
                BigDecimal profit = item.getSellPrice().subtract(purchase).subtract(expenses);
                if (profit.signum() >= 0) {
                    totalProfit = totalProfit.add(profit);
                } else {
                    totalLoss = totalLoss.add(profit.abs());
                }
            } else {
                availableItems++;
                inventoryValue = inventoryValue.add(purchase).add(expenses);
            }
        }

        BigDecimal balance = totalSales.subtract(totalPurchases).subtract(totalExpenses);
        BigDecimal netProfit = totalProfit.subtract(totalLoss);
        BigDecimal averageMargin = totalSales.signum() > 0
                ? netProfit.divide(totalSales, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        return new FinancialSummaryDTO(
                balance,
                totalPurchases.add(totalExpenses),
                totalPurchases,
                totalExpenses,
                totalSales,
                totalProfit,
                totalLoss,
                averageMargin,
                inventoryValue,
                items.size(),
                availableItems,
                soldItems
        );
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    public void recalculateItemMetrics(Item item) {
        if (item.getStatus() != ItemStatus.SOLD || item.getSellPrice() == null) {
            return;
        }

        BigDecimal additionalExpenses = item.getExpense().stream()
                .map(expense -> expense.getAmount() == null
                        ? BigDecimal.ZERO
                        : expense.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCost = item.getBuyPrice().add(additionalExpenses);
        BigDecimal profit = item.getSellPrice().subtract(totalCost);

        item.setProfit(profit);
        item.setMargin(item.getSellPrice().compareTo(BigDecimal.ZERO) > 0
                ? profit.divide(item.getSellPrice(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO);
    }
}
