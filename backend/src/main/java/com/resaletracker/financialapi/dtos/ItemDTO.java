package com.resaletracker.financialapi.dtos;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.resaletracker.financialapi.entities.Item;
import com.resaletracker.financialapi.entities.ItemStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "imgUrl", "status", "buyPrice", "buyDate", "sellPrice", "sellDate", "profit", "margin", "category"})
public class ItemDTO {
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
    private CategoryDTO category;

    public ItemDTO(Item entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.imgUrl = entity.getImgUrl();
        this.buyPrice = entity.getBuyPrice();
        this.sellPrice = entity.getSellPrice();
        this.buyDate = entity.getBuyDate();
        this.sellDate = entity.getSellDate();
        this.status = entity.getStatus();
        this.profit = entity.getProfit();
        this.margin = entity.getMargin();
        this.category = new CategoryDTO(entity.getCategory());
    }
}
