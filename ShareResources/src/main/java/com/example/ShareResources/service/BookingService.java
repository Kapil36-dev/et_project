package com.example.ShareResources.service;

import com.example.ShareResources.model.Booking;
import com.example.ShareResources.model.BookingStatus;
import com.example.ShareResources.model.Item;
import com.example.ShareResources.model.ItemStatus;
import com.example.ShareResources.repository.BookingRepository;
import com.example.ShareResources.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ItemRepository itemRepository;

    // Borrower Action: Initiates a booking request
    public Booking createBooking(Booking booking) {
        
        booking.setCreationDate(LocalDateTime.now());
        
        Optional<Item> itemOptional = itemRepository.findById(booking.getItemId());

        if (itemOptional.isPresent() && itemOptional.get().getStatus() == ItemStatus.AVAILABLE) {
            Item item = itemOptional.get();

            booking.setStatus(BookingStatus.PENDING);
            Booking savedBooking = bookingRepository.save(booking);

            item.setStatus(ItemStatus.BOOKED);
            itemRepository.save(item);

            return savedBooking;
        }
        
        return null; 
    }

    // Service Provider Action: Approves the booking
    public Optional<Booking> approveBooking(String bookingId) {
        return bookingRepository.findById(bookingId).map(booking -> {
            booking.setStatus(BookingStatus.ACCEPTED);
            return bookingRepository.save(booking);
        });
    }

    // Service Provider Action: Rejects the booking
    public Optional<Booking> rejectBooking(String bookingId) {
        return bookingRepository.findById(bookingId).map(booking -> {
            booking.setStatus(BookingStatus.REJECTED);
            Booking rejectedBooking = bookingRepository.save(booking);

            itemRepository.findById(booking.getItemId()).ifPresent(item -> {
                item.setStatus(ItemStatus.AVAILABLE);
                itemRepository.save(item);
            });
            return rejectedBooking;
        });
    }
    
    // Service Provider Action: Confirms the item is returned ⬅️ ADDED THIS METHOD
    public Optional<Booking> returnItem(String bookingId) {
        return bookingRepository.findById(bookingId).map(booking -> {
            
            // 1. Update Booking status to COMPLETED
            booking.setStatus(BookingStatus.COMPLETED);
            Booking completedBooking = bookingRepository.save(booking);

            // 2. CRITICAL: Revert Item status back to AVAILABLE
            itemRepository.findById(booking.getItemId()).ifPresent(item -> {
                item.setStatus(ItemStatus.AVAILABLE);
                itemRepository.save(item);
            });
            
            return completedBooking;
        });
    }

    // History lookup method
    public List<Booking> findAllByUserId(String userId) { 
        return bookingRepository.findByBorrowerIdOrServiceProviderUserId(userId, userId);
    }
}