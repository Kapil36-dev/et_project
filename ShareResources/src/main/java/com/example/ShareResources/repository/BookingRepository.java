package com.example.ShareResources.repository;

import com.example.ShareResources.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Import List

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Finds all bookings where the userId is either the borrowerId OR the serviceProviderUserId
    List<Booking> findByBorrowerIdOrServiceProviderUserId(String borrowerId, String serviceProviderUserId);
}