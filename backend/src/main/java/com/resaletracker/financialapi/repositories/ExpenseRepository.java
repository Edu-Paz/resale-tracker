package com.resaletracker.financialapi.repositories;

import com.resaletracker.financialapi.entities.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}
