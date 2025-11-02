package com.example.ShareResources.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "history")
public class History {
    @Id
    private String historyId;
    private String itemId;
    private String userId; // User who generated the history (e.g., left feedback)
    private HistoryType type; // Uses the fixed Enum (SP or Borrower History)
    private String feedback;
    private int rating;
    private LocalDateTime date = LocalDateTime.now();
}
