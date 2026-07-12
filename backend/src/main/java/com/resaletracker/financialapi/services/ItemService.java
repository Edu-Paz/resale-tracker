package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.ItemDTO;
import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.repositories.CategoryRepository;
import com.resaletracker.financialapi.repositories.ItemRepository;
import com.resaletracker.financialapi.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ItemService(ItemRepository itemRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ItemDTO> findAllItemsByUser(Long userId, Long categoryId) {
        // 1. Validate if the user exists.
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found with id: " + userId);
        }

        List<Item> items;

        // 2. Decide which repository method to call
        if (categoryId != null) {
            // If a categoryId is provided, validate if the category belongs to the user before fetching
            categoryRepository.findByIdAndUserId(categoryId, userId)
                    .orElseThrow(() -> new EntityNotFoundException("Category with id " + categoryId + " not found for user " + userId));

            items = itemRepository.findAllByCategory_UserIdAndCategoryId(userId, categoryId);
        } else {
            // If no categoryId is provided, fetch all items for the user
            items = itemRepository.findAllByCategory_UserId(userId);
        }

        // 3. Map the list of entities to a list of DTOs
        return items.stream()
                .map(ItemDTO::new)
                .toList();
    }
}
