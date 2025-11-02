package com.example.ShareResources.model;
import com.example.ShareResources.model.BookingStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id; // Changed to standard 'id' for consistency
    
    private String itemId;
    private String borrowerId;
    private String serviceProviderUserId;
    
    // ADDED: The fields your JSON is sending
    private LocalDateTime startDate; 
    private LocalDateTime endDate;
    private LocalDateTime creationDate;
    
    // Optional: Keep a creation timestamp, but set it manually or in the service
   // private LocalDateTime creationDate = LocalDateTime.now(); 
    
    private BookingStatus status;
}