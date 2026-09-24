package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.ExpenseDTO;
import com.resaletracker.financialapi.dtos.ExpenseUpdateDTO;
import com.resaletracker.financialapi.entities.Expense;
import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.repositories.ExpenseRepository;
import com.resaletracker.financialapi.repositories.ItemRepository;
import com.resaletracker.financialapi.services.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExpenseService {

    private static final String EXPENSE_NOT_FOUND_MESSAGE = "Expense not found with id: ";

    private final ExpenseRepository expenseRepository;
    private final ItemRepository itemRepository;
    private final AuthService authService;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            ItemRepository itemRepository,
            AuthService authService
    ) {
        this.expenseRepository = expenseRepository;
        this.itemRepository = itemRepository;
        this.authService = authService;
    }

    @Transactional
    public ExpenseDTO create(Long itemId, ExpenseDTO expenseDTO) {
        User user = authService.getAuthenticatedUser();
        Item item = itemRepository.findById(itemId)
                .filter(foundItem -> foundItem.getCategory().getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item not found with id: " + itemId + " for the current user"
                ));

        Expense expense = new Expense();
        expense.setName(expenseDTO.getName());
        expense.setAmount(expenseDTO.getAmount());
        item.addExpense(expense);

        Expense savedExpense = expenseRepository.save(expense);

        return new ExpenseDTO(savedExpense);
    }

    @Transactional(readOnly = true)
    public ExpenseDTO getExpenseById(Long expenseId) {
        User user = authService.getAuthenticatedUser();
        Expense expense = expenseRepository.findById(expenseId)
                .filter(foundExpense -> foundExpense.getItem().getCategory().getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException(EXPENSE_NOT_FOUND_MESSAGE + expenseId));

        return new ExpenseDTO(expense);
    }

    @Transactional
    public ExpenseDTO updateExpenseById(Long expenseId, ExpenseUpdateDTO expenseUpdateDTO) {
        User user = authService.getAuthenticatedUser();
        Expense expense = expenseRepository.findById(expenseId)
                .filter(foundExpense ->
                        foundExpense.getItem().getCategory().getUser().getId().equals(user.getId())
                )
                .orElseThrow(() -> new ResourceNotFoundException(
                        EXPENSE_NOT_FOUND_MESSAGE + expenseId
                ));

        expense.setName(expenseUpdateDTO.getName());
        expense.setAmount(expenseUpdateDTO.getAmount());

        return new ExpenseDTO(expenseRepository.save(expense));
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getAllExpensesByItem(Long itemId) {
        User user = authService.getAuthenticatedUser();
        itemRepository.findById(itemId)
                .filter(item -> item.getCategory().getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item not found with id: " + itemId + " for the current user"
                ));

        return expenseRepository.findAllByItemId(itemId)
                .stream()
                .map(ExpenseDTO::new)
                .toList();
    }

    @Transactional
    public void deleteById(Long expenseId) {
        User user = authService.getAuthenticatedUser();
        Expense expense = expenseRepository.findById(expenseId)
                .filter(foundExpense ->
                        foundExpense.getItem().getCategory().getUser().getId().equals(user.getId())
                )
                .orElseThrow(() -> new ResourceNotFoundException(
                        EXPENSE_NOT_FOUND_MESSAGE + expenseId
                ));

        expenseRepository.delete(expense);
    }
}
