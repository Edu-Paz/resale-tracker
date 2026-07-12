package com.resaletracker.financialapi.controllers;

import com.resaletracker.financialapi.dtos.ItemDTO;
import com.resaletracker.financialapi.services.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/items")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> findAllItemsByUser(@RequestParam Long userId, @RequestParam(required = false) Long categoryId) {
        List<ItemDTO> items = itemService.findAllItemsByUser(userId, categoryId);
        // TODO: Substituir userId pelo usuário autenticado
        return ResponseEntity.ok(items);
    }
}
