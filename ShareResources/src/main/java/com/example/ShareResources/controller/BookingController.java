package com.example.ShareResources.controller;

import com.example.ShareResources.model.Booking;
import com.example.ShareResources.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // POST /api/bookings/initiate - Borrower initiates booking
    @PostMapping("/initiate") 
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking newBooking = bookingService.createBooking(booking);
        
        if (newBooking == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
        
        return new ResponseEntity<>(newBooking, HttpStatus.CREATED);
    }

    // PUT /api/bookings/{bookingId}/approve - SP approves
    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<Booking> approveBooking(@PathVariable String bookingId) {
        return bookingService.approveBooking(bookingId)
                .map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // PUT /api/bookings/{bookingId}/reject - SP rejects (reverts item status)
    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable String bookingId) {
        return bookingService.rejectBooking(bookingId)
                .map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // PUT /api/bookings/{bookingId}/return - SP confirms item return ⬅️ ADDED THIS
    @PutMapping("/{bookingId}/return")
    public ResponseEntity<Booking> returnItem(@PathVariable String bookingId) {
        return bookingService.returnItem(bookingId)
                .map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // GET /api/bookings/user/{userId} - Check all booking history for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable String userId) {
        List<Booking> userBookings = bookingService.findAllByUserId(userId);
        
        if (userBookings.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userBookings, HttpStatus.OK);
    }
}