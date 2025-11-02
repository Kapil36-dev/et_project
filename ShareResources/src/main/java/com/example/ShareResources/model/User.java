package com.example.ShareResources.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String userId;
    
   
    private String userName;
    
    private String password;
    private String email;
    
    
    private UserRole userRole;
    
    // You can add more fields here if needed for the model
    // private String address;
    // private String phoneNumber;
}