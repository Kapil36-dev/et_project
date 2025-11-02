
package com.example.ShareResources.repository;

import com.example.ShareResources.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    // String is the data type of the @Id field (itemId) in Item.java
}