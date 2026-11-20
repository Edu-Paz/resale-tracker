package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.entities.ItemStatus;
import com.resaletracker.financialapi.repositories.ItemRepository;
import com.resaletracker.financialapi.dtos.user.FinancialSummaryProjectionDTO;
import com.resaletracker.financialapi.dtos.user.FinancialSummaryDTO;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class BalanceService {
    private final ItemRepository itemRepository;
    private final BalanceService self;

    public BalanceService(ItemRepository itemRepository, @Lazy BalanceService self) {
        this.itemRepository = itemRepository;
        this.self = self;
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateByUserId(Long userId) {
        return self.calculateFinancialSummaryByUserId(userId).getBalance();
    }

    @Transactional(readOnly = true)
    public FinancialSummaryDTO calculateFinancialSummaryByUserId(Long userId) {
        FinancialSummaryProjectionDTO aggregate =
                itemRepository.summarizeFinancialSummaryByUserId(userId, ItemStatus.SOLD);

        BigDecimal netProfit = aggregate.getTotalProfit().subtract(aggregate.getTotalLoss());
        BigDecimal balance = aggregate.getTotalSales()
                .subtract(aggregate.getTotalPurchases())
                .subtract(aggregate.getTotalExpenses());
        BigDecimal averageMargin = aggregate.getTotalSales().signum() > 0
                ? netProfit.divide(aggregate.getTotalSales(), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        return new FinancialSummaryDTO(
                balance,
                aggregate.getTotalPurchases().add(aggregate.getTotalExpenses()),
                aggregate.getTotalPurchases(),
                aggregate.getTotalExpenses(),
                aggregate.getTotalSales(),
                aggregate.getTotalProfit(),
                aggregate.getTotalLoss(),
                averageMargin,
                aggregate.getInventoryValue(),
                aggregate.getTotalItems(),
                aggregate.getAvailableItems(),
                aggregate.getSoldItems()
        );
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
