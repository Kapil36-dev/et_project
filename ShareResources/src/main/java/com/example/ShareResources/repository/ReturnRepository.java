package com.example.ShareResources.repository;

import com.example.ShareResources.model.Return;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnRepository extends MongoRepository<Return, String> {
    // String is the data type of the @Id field (returnId) in Return.java
}