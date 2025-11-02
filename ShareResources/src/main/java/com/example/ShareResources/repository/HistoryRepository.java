package com.example.ShareResources.repository;

import com.example.ShareResources.model.History;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryRepository extends MongoRepository<History, String> {
    // String is the data type of the @Id field (historyId) in History.java
}