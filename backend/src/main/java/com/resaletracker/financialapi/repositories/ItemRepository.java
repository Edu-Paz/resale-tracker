package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.dtos.user.FinancialSummaryProjectionDTO;
import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.entities.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findAllByCategory_UserId(Long userId);

    List<Item> findAllByCategory_UserIdAndCategoryId(Long userId, Long categoryId);

    @Query("""
            SELECT new com.resaletracker.financialapi.dtos.user.FinancialSummaryProjectionDTO(
                COUNT(i),
                COALESCE(SUM(COALESCE(i.buyPrice, 0)), 0),
                COALESCE(SUM(COALESCE((SELECT SUM(e.amount) FROM Expense e WHERE e.item = i), 0)), 0),
                COALESCE(SUM(CASE
                    WHEN i.status = :soldStatus AND i.sellPrice IS NOT NULL THEN i.sellPrice
                    ELSE 0 END), 0),
                COALESCE(SUM(CASE
                    WHEN i.status = :soldStatus AND i.sellPrice IS NOT NULL
                        AND i.sellPrice - COALESCE(i.buyPrice, 0)
                          - COALESCE((SELECT SUM(e.amount) FROM Expense e WHERE e.item = i), 0) >= 0
                    THEN i.sellPrice - COALESCE(i.buyPrice, 0)
                           - COALESCE((SELECT SUM(e.amount) FROM Expense e WHERE e.item = i), 0)
                    ELSE 0 END), 0),
                COALESCE(SUM(CASE
                    WHEN i.status = :soldStatus AND i.sellPrice IS NOT NULL
                        AND i.sellPrice - COALESCE(i.buyPrice, 0)
                          - COALESCE((SELECT SUM(e.amount) FROM Expense e WHERE e.item = i), 0) < 0
                    THEN COALESCE(i.buyPrice, 0)
                           + COALESCE((SELECT SUM(e.amount) FROM Expense e WHERE e.item = i), 0)
                           - i.sellPrice
                    ELSE 0 END), 0),
                COALESCE(SUM(CASE
                    WHEN i.status = :soldStatus AND i.sellPrice IS NOT NULL THEN 0
                    ELSE COALESCE(i.buyPrice, 0)
                           + COALESCE((SELECT SUM(e.amount) FROM Expense e WHERE e.item = i), 0)
                    END), 0),
                COUNT(CASE WHEN i.status = :soldStatus AND i.sellPrice IS NOT NULL THEN 1 END),
                COUNT(CASE WHEN i.status = :soldStatus AND i.sellPrice IS NOT NULL THEN NULL ELSE 1 END)
            )
            FROM Item i
            WHERE i.category.user.id = :userId
            """)
    FinancialSummaryProjectionDTO summarizeFinancialSummaryByUserId(
            @Param("userId") Long userId,
            @Param("soldStatus") ItemStatus soldStatus);
}
