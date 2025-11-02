package com.example.ShareResources.service;

import com.example.ShareResources.model.Booking;
import com.example.ShareResources.model.BookingStatus;
import com.example.ShareResources.model.Payment;
import com.example.ShareResources.model.PaymentStatus;
import com.example.ShareResources.repository.BookingRepository;
import com.example.ShareResources.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Optional;
import java.util.List; // ⬅️ ADD THIS IMPORT

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ... (existing processPayment method) ...

    /**
     * Processes the simulated payment, updates the status, and saves the record.
     */
    public Payment processPayment(Payment payment) {
        
        // Set creation date before any potential early exit
        payment.setCreationDate(LocalDateTime.now());
        
        // 1. Check if the booking exists and is ACCEPTED
        Optional<Booking> bookingOptional = bookingRepository.findById(payment.getBookingId());

        if (bookingOptional.isEmpty() || bookingOptional.get().getStatus() != BookingStatus.ACCEPTED) {
            return null;
        }
        
        Booking booking = bookingOptional.get();

        // 2. DETERMINE PAYMENT STATUS based on simulation status from the Payment object
        String simulationStatus = payment.getSimulationStatus();

        if ("SUCCESS".equalsIgnoreCase(simulationStatus)) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setTransactionId(UUID.randomUUID().toString());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setTransactionId("FAILED_TXN_" + UUID.randomUUID().toString());
        }

        // 3. SAVE THE PAYMENT (Generates the 'id' field)
        Payment savedPayment = paymentRepository.save(payment);

        // 4. UPDATE THE BOOKING STATUS if payment was successful
        if (savedPayment.getStatus() == PaymentStatus.COMPLETED) {
            // Update the booking status from ACCEPTED to CONFIRMED
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }
        
        return savedPayment;
    }

    /**
     * Finds all payment records associated with a specific borrower ID. ⬅️ ADDED THIS METHOD
     */
    public List<Payment> findAllByBorrowerId(String borrowerId) {
        // This relies on the method being defined in PaymentRepository
        return paymentRepository.findAllByBorrowerId(borrowerId);
    }
}