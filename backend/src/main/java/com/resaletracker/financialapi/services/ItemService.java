package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.ItemDTO;
import com.resaletracker.financialapi.dtos.ItemInsertDTO;
import com.resaletracker.financialapi.dtos.ItemSellDTO;
import com.resaletracker.financialapi.entities.Category;
import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.entities.ItemStatus;
import com.resaletracker.financialapi.repositories.CategoryRepository;
import com.resaletracker.financialapi.repositories.ItemRepository;
import com.resaletracker.financialapi.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    @Transactional
    public ItemDTO createItem(ItemInsertDTO itemInsertDTO, Long userId) {
        // 1. Validate and fetch the category, ensuring it belongs to the user.
        Category category = categoryRepository.findByIdAndUserId(itemInsertDTO.getCategoryId(), userId)
                .orElseThrow(() -> new EntityNotFoundException("Category with id " + itemInsertDTO.getCategoryId() + " not found for user " + userId));

        // 2. Instantiate the new Item entity.
        Item item = new Item();

        // 3. Map data from the DTO to the entity.
        item.setName(itemInsertDTO.getName());
        item.setImgUrl(itemInsertDTO.getImgUrl());
        item.setBuyPrice(itemInsertDTO.getBuyPrice());
        item.setBuyDate(itemInsertDTO.getBuyDate());
        item.setCategory(category); // Associate the validated category.

        // 4. Set default values for a new item.
        item.setStatus(ItemStatus.AVAILABLE);
        item.setSellPrice(null);
        item.setSellDate(null);
        item.setProfit(null);
        item.setMargin(null);

        // 5. Save the new entity to the database.
        item = itemRepository.save(item);

        // 6. Return the complete DTO.
        return new ItemDTO(item);
    }

    @Transactional
    public ItemDTO sellItem(Long itemId, Long userId, ItemSellDTO sellDTO) {
        // 1. Fetch the item, ensuring it belongs to the user.
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + itemId));

        if (!item.getCategory().getUser().getId().equals(userId)) {
            // Use a more appropriate exception for authorization failures
            throw new SecurityException("User not authorized to sell this item.");
        }

        // 2. Check if the item is already sold.
        if (item.getStatus() == ItemStatus.SOLD) {
            throw new IllegalStateException("Item with id " + itemId + " has already been sold.");
        }

        // 3. Update item details from the DTO.
        item.setSellPrice(sellDTO.getSellPrice());
        item.setSellDate(sellDTO.getSellDate());
        item.setStatus(ItemStatus.SOLD);

        // 4. Calculate profit and margin.
        BigDecimal profit = item.getSellPrice().subtract(item.getBuyPrice());
        item.setProfit(profit);

        if (item.getSellPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal margin = profit.divide(item.getSellPrice(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
            item.setMargin(margin);
        } else {
            item.setMargin(BigDecimal.ZERO);
        }

        // 5. Save the updated entity.
        item = itemRepository.save(item);

        // 6. Return the updated DTO.
        return new ItemDTO(item);
    }

    @Transactional(readOnly = true)
    public ItemDTO getById(Long itemId, Long userId){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + itemId));

        if(!item.getCategory().getUser().getId().equals(userId)){
            throw new SecurityException("ITem does not belong to this User");
        }

        return new ItemDTO(item);
    }

    @Transactional
    public void deleteById (Long itemId, Long userId){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + itemId));

        if(!item.getCategory().getUser().getId().equals(userId)){
            throw new SecurityException("ITem does not belong to this User");
        }

        if(item.getStatus() == ItemStatus.SOLD){
            throw new IllegalStateException("Cannot delete an item that has already been sold.");
        }

        itemRepository.deleteById(itemId);
    }
}
