package com.example.ShareResources.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "returns")
public class Return {
    @Id
    private String returnId;
    private String itemId;
    private String borrowerId;
    private LocalDateTime initiatedDate = LocalDateTime.now();
    private ReturnStatus returnStatus; // Uses the fixed Enum
}