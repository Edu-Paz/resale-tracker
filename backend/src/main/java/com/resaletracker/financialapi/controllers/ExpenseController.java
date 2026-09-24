package com.resaletracker.financialapi.controllers;

import com.resaletracker.financialapi.dtos.ExpenseDTO;
import com.resaletracker.financialapi.services.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/expense")
public class ExpenseController {
    public final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@RequestBody @Valid ExpenseDTO expenseDTO) {
        ExpenseDTO savedExpense = expenseService.create(expenseDTO.getItemDTO().getId(), expenseDTO);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedExpense.getId())
                .toUri();
        return ResponseEntity.created(uri).body(savedExpense);
    }

    @GetMapping(value = "/{expenseId}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long expenseId) {
        ExpenseDTO expenseDTO = expenseService.getExpenseById(expenseId);

        return ResponseEntity.ok(expenseDTO);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long expenseId) {
        expenseService.deleteById(expenseId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ExpenseDTO>> getAllExpensesByItem(@PathVariable Long itemId) {
        List<ExpenseDTO> expenseDTOList = expenseService.getAllExpensesByItem(itemId);

        return ResponseEntity.ok(expenseDTOList);
    }
}
