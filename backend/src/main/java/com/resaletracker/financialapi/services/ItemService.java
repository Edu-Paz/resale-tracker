package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.ItemDTO;
import com.resaletracker.financialapi.dtos.ItemInsertDTO;
import com.resaletracker.financialapi.dtos.ItemSellDTO;
import com.resaletracker.financialapi.dtos.ItemUpdateDTO;
import com.resaletracker.financialapi.entities.Category;
import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.entities.ItemStatus;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.repositories.CategoryRepository;
import com.resaletracker.financialapi.repositories.ItemRepository;
import com.resaletracker.financialapi.services.exceptions.BusinessException;
import com.resaletracker.financialapi.services.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final AuthService authService;

    public ItemService(ItemRepository itemRepository, CategoryRepository categoryRepository, AuthService authService) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public List<ItemDTO> findAllItemsByUser(Long categoryId) {
        User user = authService.getAuthenticatedUser();
        List<Item> items;
        if (categoryId != null) {
            categoryRepository.findByIdAndUserId(categoryId, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category with id " + categoryId + " not found for user " + user.getId()));
            items = itemRepository.findAllByCategory_UserIdAndCategoryId(user.getId(), categoryId);
        } else {
            items = itemRepository.findAllByCategory_UserId(user.getId());
        }
        return items.stream().map(ItemDTO::new).toList();
    }

    @Transactional
    public ItemDTO createItem(ItemInsertDTO itemInsertDTO) {
        User user = authService.getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUserId(itemInsertDTO.getCategoryId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category with id " + itemInsertDTO.getCategoryId() + " not found for user " + user.getId()));

        Item item = new Item();
        item.setName(itemInsertDTO.getName());
        item.setImgUrl(itemInsertDTO.getImgUrl());
        item.setBuyPrice(itemInsertDTO.getBuyPrice());
        item.setBuyDate(itemInsertDTO.getBuyDate());
        item.setCategory(category);
        item.setStatus(ItemStatus.AVAILABLE);
        item = itemRepository.save(item);
        return new ItemDTO(item);
    }

    @Transactional
    public ItemDTO sellItem(Long itemId, ItemSellDTO sellDTO) {
        User user = authService.getAuthenticatedUser();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        if (!item.getCategory().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Item not found with id: " + itemId + " for this user");
        }

        if (item.getStatus() == ItemStatus.SOLD) {
            throw new BusinessException("Item with id " + itemId + " has already been sold.");
        }

        item.setSellPrice(sellDTO.getSellPrice());
        item.setSellDate(sellDTO.getSellDate());
        item.setStatus(ItemStatus.SOLD);

        BigDecimal profit = item.getSellPrice().subtract(item.getBuyPrice());
        item.setProfit(profit);

        if (item.getSellPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal margin = profit.divide(item.getSellPrice(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
            item.setMargin(margin);
        } else {
            item.setMargin(BigDecimal.ZERO);
        }

        return new ItemDTO(item);
    }

    @Transactional(readOnly = true)
    public ItemDTO getById(Long itemId) {
        User user = authService.getAuthenticatedUser();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        if (!item.getCategory().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Item not found with id: " + itemId + " for this user");
        }

        return new ItemDTO(item);
    }

    @Transactional
    public void deleteById(Long itemId) {
        User user = authService.getAuthenticatedUser();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        if (!item.getCategory().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Item not found with id: " + itemId + " for this user");
        }

        if (item.getStatus() == ItemStatus.SOLD) {
            throw new BusinessException("Cannot delete an item that has already been sold.");
        }

        itemRepository.deleteById(itemId);
    }

    @Transactional
    public ItemDTO updateItem(Long itemId, ItemUpdateDTO itemUpdateDTO) {
        User user = authService.getAuthenticatedUser();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        if (!item.getCategory().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Item not found with id: " + itemId + " for this user");
        }

        if (item.getStatus() != ItemStatus.AVAILABLE) {
            throw new BusinessException("Only items with AVAILABLE status can be edited.");
        }

        if (itemUpdateDTO.getName() != null) {
            item.setName(itemUpdateDTO.getName());
        }
        if (itemUpdateDTO.getImgUrl() != null) {
            item.setImgUrl(itemUpdateDTO.getImgUrl());
        }
        if (itemUpdateDTO.getBuyPrice() != null) {
            item.setBuyPrice(itemUpdateDTO.getBuyPrice());
        }
        if (itemUpdateDTO.getBuyDate() != null) {
            item.setBuyDate(itemUpdateDTO.getBuyDate());
        }
        if (itemUpdateDTO.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(itemUpdateDTO.getCategoryId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category with id " + itemUpdateDTO.getCategoryId() + " not found for user " + user.getId()));
            item.setCategory(category);
        }

        return new ItemDTO(item);
    }
}
