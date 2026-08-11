package com.resaletracker.financialapi.controllers;

import com.resaletracker.financialapi.dtos.ItemDTO;
import com.resaletracker.financialapi.dtos.ItemInsertDTO;
import com.resaletracker.financialapi.dtos.ItemSellDTO;
import com.resaletracker.financialapi.dtos.ItemUpdateDTO;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.services.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Access Denied: User not authenticated.");
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User authenticatedUser)) {
            throw new AccessDeniedException("Access Denied: User principal not found or invalid type.");
        }
        if (authenticatedUser.getId() == null) {
            throw new AccessDeniedException("Access Denied: Authenticated user ID is null.");
        }
        return authenticatedUser.getId();
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> findAllItemsByUser(@RequestParam(required = false) Long categoryId) {
        Long authenticatedUserId = getAuthenticatedUserId();
        List<ItemDTO> items = itemService.findAllItemsByUser(authenticatedUserId, categoryId);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<ItemDTO> createItem(@RequestBody @Valid ItemInsertDTO itemInsertDTO) {
        Long authenticatedUserId = getAuthenticatedUserId();
        ItemDTO itemDTO = itemService.createItem(itemInsertDTO, authenticatedUserId);
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
        Long authenticatedUserId = getAuthenticatedUserId();
        ItemDTO soldItem = itemService.sellItem(itemId, authenticatedUserId, sellDTO);
        return ResponseEntity.ok(soldItem);
    }

    @GetMapping(value = "/{itemId}")
    public ResponseEntity<ItemDTO> getById(@PathVariable Long itemId) {
        Long authenticatedUserId = getAuthenticatedUserId();
        ItemDTO itemDTO = itemService.getById(itemId, authenticatedUserId);
        return ResponseEntity.ok(itemDTO);
    }

    @DeleteMapping(value = "/{itemId}")
    public ResponseEntity<Void> deleteById(@PathVariable Long itemId) {
        Long authenticatedUserId = getAuthenticatedUserId();
        itemService.deleteById(itemId, authenticatedUserId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{itemId}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable Long itemId,
                                              @RequestBody @Valid ItemUpdateDTO itemUpdateDTO) {
        Long authenticatedUserId = getAuthenticatedUserId();
        ItemDTO itemUpdated = itemService.updateItem(itemId, authenticatedUserId, itemUpdateDTO);
        return ResponseEntity.ok(itemUpdated);
    }
}
