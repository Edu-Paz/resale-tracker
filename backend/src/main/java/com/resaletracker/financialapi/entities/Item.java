package com.resaletracker.financialapi.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(exclude = {"category", "expense"})
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String imgUrl;
    private BigDecimal buyPrice;
    private BigDecimal sellPrice;
    private LocalDate buyDate;
    private LocalDate sellDate;
    private ItemStatus status;
    private BigDecimal profit;
    private BigDecimal margin;

    @ManyToOne(optional = false)
    @ToString.Exclude
    private Category category;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Setter(AccessLevel.NONE)
    private List<Expense> expense = new ArrayList<>();

    public void addExpense(Expense expense) {
        this.expense.add(expense);
        expense.setItem(this);
    }

    public void removeExpense(Expense expense) {
        this.expense.remove(expense);
        expense.setItem(null);
    }
}
