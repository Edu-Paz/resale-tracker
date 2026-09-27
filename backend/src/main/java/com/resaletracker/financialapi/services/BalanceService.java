package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.entities.ItemStatus;
import com.resaletracker.financialapi.repositories.ItemRepository;
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
        return itemRepository.calculateBalanceByUserId(userId);
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
