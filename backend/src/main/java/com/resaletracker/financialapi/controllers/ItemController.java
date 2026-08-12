package com.resaletracker.financialapi.controllers;

import com.resaletracker.financialapi.dtos.ItemDTO;
import com.resaletracker.financialapi.dtos.ItemInsertDTO;
import com.resaletracker.financialapi.dtos.ItemSellDTO;
import com.resaletracker.financialapi.dtos.ItemUpdateDTO;
import com.resaletracker.financialapi.services.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/items")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> findAllItemsByUser(@RequestParam(required = false) Long categoryId) {
        List<ItemDTO> items = itemService.findAllItemsByUser(categoryId);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<ItemDTO> createItem(@RequestBody @Valid ItemInsertDTO itemInsertDTO) {
        ItemDTO itemDTO = itemService.createItem(itemInsertDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(itemDTO.getId())
                .toUri();
        return ResponseEntity.created(uri).body(itemDTO);
    }

    @PatchMapping(value = "/{itemId}/sell")
    public ResponseEntity<ItemDTO> sellItem(
            @PathVariable Long itemId,
            @RequestBody @Valid ItemSellDTO sellDTO) {
        ItemDTO soldItem = itemService.sellItem(itemId, sellDTO);
        return ResponseEntity.ok(soldItem);
    }

    @GetMapping(value = "/{itemId}")
    public ResponseEntity<ItemDTO> getById(@PathVariable Long itemId) {
        ItemDTO itemDTO = itemService.getById(itemId);
        return ResponseEntity.ok(itemDTO);
    }

    @DeleteMapping(value = "/{itemId}")
    public ResponseEntity<Void> deleteById(@PathVariable Long itemId) {
        itemService.deleteById(itemId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{itemId}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable Long itemId,
                                              @RequestBody @Valid ItemUpdateDTO itemUpdateDTO) {
        ItemDTO itemUpdated = itemService.updateItem(itemId, itemUpdateDTO);
        return ResponseEntity.ok(itemUpdated);
    }
}
