package com.example.ShareResources.controller;

import com.example.ShareResources.model.Item;
import com.example.ShareResources.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // POST /api/items/register - Service Provider adds a new item
    // ⬅️ FIX: Changed mapping to include "/register" as requested by your API call
    @PostMapping("/register") 
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        Item newItem = itemService.createItem(item);
        return new ResponseEntity<>(newItem, HttpStatus.CREATED);
    }

    // GET /api/items/{itemId}
    @GetMapping("/{itemId}")
    public ResponseEntity<Item> getItemById(@PathVariable String itemId) {
        Optional<Item> item = itemService.findById(itemId);
        return item.map(ResponseEntity::ok)
                   .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // GET /api/items - Get all AVAILABLE items
    // NOTE: This now takes the base path since /register is no longer taking the base path
    @GetMapping 
    public List<Item> getAllAvailableItems() {
        return itemService.findAllAvailableItems();
    }
        
    // PUT /api/items/{itemId} - Updates an existing item
    @PutMapping("/{itemId}")
    public ResponseEntity<Item> updateItem(@PathVariable String itemId, @RequestBody Item updatedItem) {
        // 1. Set the ID from the path variable onto the item object
        updatedItem.setId(itemId);

        // 2. Call the service layer to save/update the item
        Item savedItem = itemService.update(updatedItem); 
        
        if (savedItem != null) {
            return ResponseEntity.ok(savedItem);
        } else {
            // Should return 404 if the original item couldn't be found
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
    }
}