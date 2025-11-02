package com.example.ShareResources.repository;

import com.example.ShareResources.model.User;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // String is the data type of the @Id field (userId) in User.java.
    // This interface now provides all basic CRUD operations for the User model.
	Optional<User> findByEmail(String email);
}
