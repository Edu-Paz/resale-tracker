package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.entities.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByItemId(Long itemId);
}
