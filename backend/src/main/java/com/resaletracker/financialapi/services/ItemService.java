package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.item.ItemDTO;
import com.resaletracker.financialapi.dtos.item.ItemInsertDTO;
import com.resaletracker.financialapi.dtos.item.ItemSellDTO;
import com.resaletracker.financialapi.dtos.item.ItemUpdateDTO;
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
    private static final String CATEGORY_NOT_FOUND_MESSAGE = "Category with id ";
    private static final String NOT_FOUND_FOR_USER = " not found for user ";
    private static final String ITEM_NOT_FOUND_MESSAGE = "Item not found with id: ";
    private static final String ITEM_NOT_FOUND_FOR_USER = " for this user";
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
                    .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MESSAGE + categoryId + NOT_FOUND_FOR_USER + user.getId()));
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
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MESSAGE + itemInsertDTO.getCategoryId() + NOT_FOUND_FOR_USER + user.getId()));

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
                .orElseThrow(() -> new ResourceNotFoundException(ITEM_NOT_FOUND_MESSAGE + itemId));

        if (!item.getCategory().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException(ITEM_NOT_FOUND_MESSAGE + itemId + ITEM_NOT_FOUND_FOR_USER);
        }

        if (item.getStatus() == ItemStatus.SOLD) {
            throw new BusinessException("Item with id " + itemId + " has already been sold.");
        }

        if (sellDTO.getSellDate() != null && sellDTO.getSellDate().isBefore(item.getBuyDate())) {
            throw new BusinessException("Sell date cannot be before buy date");
        }

        item.setSellPrice(sellDTO.getSellPrice());
        item.setSellDate(sellDTO.getSellDate());
        item.setStatus(ItemStatus.SOLD);

        recalculateFinancialMetrics(item);

        return new ItemDTO(item);
    }

    @Transactional(readOnly = true)
    public ItemDTO getById(Long itemId) {
        User user = authService.getAuthenticatedUser();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ITEM_NOT_FOUND_MESSAGE + itemId));

        if (!item.getCategory().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException(ITEM_NOT_FOUND_MESSAGE + itemId + ITEM_NOT_FOUND_FOR_USER);
        }

        return new ItemDTO(item);
    }

    @Transactional
    public void deleteById(Long itemId) {
        User user = authService.getAuthenticatedUser();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ITEM_NOT_FOUND_MESSAGE + itemId));

        if (!item.getCategory().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException(ITEM_NOT_FOUND_MESSAGE + itemId + ITEM_NOT_FOUND_FOR_USER);
        }

        itemRepository.deleteById(itemId);
    }

    @Transactional
    public ItemDTO updateItem(Long itemId, ItemUpdateDTO itemUpdateDTO) {
        User user = authService.getAuthenticatedUser();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ITEM_NOT_FOUND_MESSAGE + itemId));

        if (!item.getCategory().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException(ITEM_NOT_FOUND_MESSAGE + itemId + ITEM_NOT_FOUND_FOR_USER);
        }

        if (itemUpdateDTO.getSellDate() != null && itemUpdateDTO.getSellDate().isBefore(item.getBuyDate())) {
            throw new BusinessException("Sell date cannot be before buy date");
        }

        if (itemUpdateDTO.getName() != null) item.setName(itemUpdateDTO.getName());
        if (itemUpdateDTO.getImgUrl() != null) item.setImgUrl(itemUpdateDTO.getImgUrl());
        if (itemUpdateDTO.getBuyPrice() != null) item.setBuyPrice(itemUpdateDTO.getBuyPrice());
        if (itemUpdateDTO.getBuyDate() != null) item.setBuyDate(itemUpdateDTO.getBuyDate());
        if (itemUpdateDTO.getSellDate() != null) item.setSellDate(itemUpdateDTO.getSellDate());
        if (itemUpdateDTO.getSellPrice() != null) item.setSellPrice(itemUpdateDTO.getSellPrice());

        if (itemUpdateDTO.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(itemUpdateDTO.getCategoryId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND_MESSAGE + itemUpdateDTO.getCategoryId() + NOT_FOUND_FOR_USER + user.getId()));
            item.setCategory(category);
        }

        if (itemUpdateDTO.getStatus() != null) {
            item.setStatus(itemUpdateDTO.getStatus());
            if (item.getStatus() == ItemStatus.AVAILABLE) {
                item.setSellPrice(null);
                item.setSellDate(null);
                item.setProfit(null);
                item.setMargin(null);
            }
        }

        if (item.getStatus() == ItemStatus.SOLD && (itemUpdateDTO.getBuyPrice() != null || itemUpdateDTO.getSellPrice() != null)) {
            recalculateFinancialMetrics(item);
        }

        return new ItemDTO(item);
    }

    public void recalculateFinancialMetrics(Item item) {
        if (item.getStatus() == ItemStatus.SOLD && item.getSellPrice() != null) {
            BigDecimal additionalExpenses = item.getExpense().stream()
                    .map(expense -> expense.getAmount() == null
                            ? BigDecimal.ZERO
                            : expense.getAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal totalCost = item.getBuyPrice().add(additionalExpenses);
            BigDecimal profit = item.getSellPrice().subtract(totalCost);
            item.setProfit(profit);

            if (item.getSellPrice().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal margin = profit.divide(item.getSellPrice(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
                item.setMargin(margin);
            } else {
                item.setMargin(BigDecimal.ZERO);
            }
        }
    }
}
