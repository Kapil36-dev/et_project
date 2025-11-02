package com.example.ShareResources.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "items")
public class Item {
    @Id
    private String id; // RENAMED from 'itemId' to 'id'
    
    private String itemName;
    private String description;
    private String serviceProviderUserId;
    private double rentalFee;
    private ItemStatus status;
}