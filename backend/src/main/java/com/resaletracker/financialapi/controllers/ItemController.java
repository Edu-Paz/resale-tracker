package com.resaletracker.financialapi.controllers;

import com.resaletracker.financialapi.dtos.ItemDTO;
import com.resaletracker.financialapi.dtos.ItemInsertDTO;
import com.resaletracker.financialapi.dtos.ItemSellDTO;
import com.resaletracker.financialapi.services.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ResponseEntity<ItemDTO> createItem(@RequestParam Long userId, @RequestBody ItemInsertDTO itemInsertDTO){
        ItemDTO itemDTO = itemService.createItem(itemInsertDTO, userId);
        return ResponseEntity.ok(itemDTO);
    }

    @PatchMapping(value = "/{itemId}/sell")
    public ResponseEntity<ItemDTO> sellItem (
            @PathVariable Long itemId,
            @RequestParam Long userId, // TODO: Substituir por usuário autenticado
            @RequestBody @Valid ItemSellDTO sellDTO){
        ItemDTO soldItem = itemService.sellItem(itemId, userId, sellDTO);
        return ResponseEntity.ok(soldItem);
    }

    @GetMapping(value = "/{itemId}")
    public ResponseEntity<ItemDTO> getById (@PathVariable Long itemId, @RequestParam Long userId){
        ItemDTO itemDTO = itemService.getById(itemId, userId);
        return ResponseEntity.ok(itemDTO);
    }

    @DeleteMapping(value = "/{itemId}")
    public ResponseEntity<Void> deleteById (@PathVariable Long itemId, @RequestParam Long userId){
        itemService.deleteById(itemId, userId);
        return ResponseEntity.noContent().build();
    }
}
