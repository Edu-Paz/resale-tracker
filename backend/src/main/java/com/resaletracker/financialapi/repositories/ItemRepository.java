package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;

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
}
