package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    /**
     * Finds all items belonging to a specific user by traversing the Category relationship.
     * @param userId The ID of the user.
     * @return A list of items.
     */
    List<Item> findAllByCategory_UserId(Long userId);

    /**
     * Finds all items belonging to a specific user AND a specific category.
     * This is more efficient than filtering in memory and ensures data integrity.
     * @param userId The ID of the user.
     * @param categoryId The ID of the category.
     * @return A list of items.
     */
    List<Item> findAllByCategory_UserIdAndCategoryId(Long userId, Long categoryId);

    @Query("""
            SELECT COALESCE(SUM(
                COALESCE(i.sellPrice, 0) - COALESCE(i.buyPrice, 0) -
                COALESCE((SELECT SUM(e.amount) FROM Expense e WHERE e.item = i), 0)
            ), 0)
            FROM Item i
            WHERE i.category.user.id = :userId
            """)
    BigDecimal calculateBalanceByUserId(@Param("userId") Long userId);
}
