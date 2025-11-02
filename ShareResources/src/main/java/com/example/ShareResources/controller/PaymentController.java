package com.example.ShareResources.controller;

import com.example.ShareResources.model.Payment;
import com.example.ShareResources.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // POST /api/payments/process - Process a payment
    @PostMapping("/process") 
    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
        
        Payment processedPayment = paymentService.processPayment(payment);
        
        if (processedPayment != null) {
            return new ResponseEntity<>(processedPayment, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // GET /api/payments/test
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return new ResponseEntity<>("Payments API is ALIVE!", HttpStatus.OK);
    }
    
    // GET /api/payments/user/{borrowerId} - Check all payment history for a borrower ⬅️ ADDED THIS
    @GetMapping("/user/{borrowerId}")
    public ResponseEntity<List<Payment>> getPaymentsByBorrower(@PathVariable String borrowerId) {
        // NOTE: paymentService.findAllByBorrowerId(borrowerId) must be implemented in the service layer
        List<Payment> payments = paymentService.findAllByBorrowerId(borrowerId);
        
        if (payments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }
}