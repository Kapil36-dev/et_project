package com.example.ShareResources.repository;

import com.example.ShareResources.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Import List

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    
    // Finds all payment records where the borrowerId matches the provided String
    List<Payment> findAllByBorrowerId(String borrowerId);
}