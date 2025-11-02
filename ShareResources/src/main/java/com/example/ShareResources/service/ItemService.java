package com.example.ShareResources.service;

import com.example.ShareResources.model.Item;
import com.example.ShareResources.model.ItemStatus;
import com.example.ShareResources.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public Item createItem(Item item) {
        // Set initial status to AVAILABLE when a new item is created
        item.setStatus(ItemStatus.AVAILABLE);
        return itemRepository.save(item);
    }

    public Optional<Item> findById(String itemId) {
        return itemRepository.findById(itemId);
    }

    public List<Item> findAllAvailableItems() {
        return itemRepository.findAll().stream()
                .filter(item -> item.getStatus() == ItemStatus.AVAILABLE)
                .toList();
    }
    
    // Add logic for updating or deleting an item here.

    public Item update(Item updatedItem) {
        // Check if an item with this ID already exists
        if (itemRepository.existsById(updatedItem.getId())) {
            // If it exists, saving it will perform an update (MongoDB upsert behavior)
            return itemRepository.save(updatedItem);
        }
        // Return null or throw an exception if the item doesn't exist
        return null;
    }
}
