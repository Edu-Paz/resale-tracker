package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.entities.Expense;
import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.repositories.ExpenseRepository;
import com.resaletracker.financialapi.repositories.ItemRepository;
import com.resaletracker.financialapi.services.exceptions.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ExpenseService {

    private ExpenseRepository expenseRepository;
    private ItemRepository itemRepository;

    public ExpenseService(ExpenseRepository expenseRepository, ItemRepository itemRepository) {
        this.expenseRepository = expenseRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public Expense create(Long itemId, Expense expense){
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        item.addExpense(expense);

        return expenseRepository.save(expense);
    }


}
