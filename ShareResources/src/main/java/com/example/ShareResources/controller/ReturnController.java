package com.example.ShareResources.controller;

import com.example.ShareResources.model.Return;
import com.example.ShareResources.service.ReturnService;
import com.example.ShareResources.dto.ReturnRequest; // <-- NEW: Import the DTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Removed unnecessary imports: java.util.Map and org.springframework.web.bind.annotation.RequestMethod

@RestController
@RequestMapping("/api/returns")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

    // POST /api/returns/initiate - Borrower initiates the return
    @PostMapping("/initiate") // <-- Reverted to the standard, cleaner annotation
    public ResponseEntity<Return> initiateReturn(@RequestBody ReturnRequest request) { // <-- FIX: Using the DTO
        
        // 1. Extract fields from the DTO
        String bookingId = request.getBookingId(); 
        String returnerId = request.getReturnerId();
        
        // 2. Simple validation
        if (bookingId == null || returnerId == null) {
            // Return 400 Bad Request if essential data is missing
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // 3. Call the service
        Return itemReturn = returnService.initiateReturn(bookingId, returnerId);
        
        if (itemReturn == null) {
            // The service returns null if the booking wasn't found or wasn't eligible for return
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
        
        return new ResponseEntity<>(itemReturn, HttpStatus.CREATED);
    }

    // PUT /api/returns/{returnId}/complete - Service Provider finalizes the return
    @PutMapping("/{returnId}/complete")
    public ResponseEntity<Return> completeReturn(@PathVariable String returnId) {
        return returnService.completeReturn(returnId)
                .map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}