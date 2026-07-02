package com.resaletracker.financialapi.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tb_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
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
}
