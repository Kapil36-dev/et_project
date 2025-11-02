package com.example.ShareResources.dto;

public class ReturnRequest {
    private String bookingId; 
    private String returnerId;

    public ReturnRequest() {
        // Default constructor for Jackson serialization
    }
    
    // Getters (Required for reading data from the object)
    public String getBookingId() {
        return bookingId;
    }

    public String getReturnerId() {
        return returnerId;
    }
    
    // Setters (Required for Spring/Jackson to populate the object from JSON)
    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public void setReturnerId(String returnerId) {
        this.returnerId = returnerId;
    }
}