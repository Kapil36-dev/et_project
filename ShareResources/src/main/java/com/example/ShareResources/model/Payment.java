package com.example.ShareResources.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
@Data
@Document(collection = "payments")
public class Payment {
    
    @Id
    // FIX: Renamed to standard 'id'. Spring Data uses this field to auto-generate the ID.
    private String id; 
    
    private String bookingId;
    private String borrowerId;      // ADDED: Needed to track who paid
    private double amount;
    private String paymentMethod;   // ADDED: Needed to track method used
    private String transactionId;   // ADDED: For real-world use

    // FIX: Changed from raw String to the strongly-typed Enum.
    private PaymentStatus status; 
    private String simulationStatus;
    private LocalDateTime creationDate;
    
    // Note: The 'simulationStatus' field from your request should ONLY be used in the 
    // Controller/Service to process the request, not saved in the final model.
}