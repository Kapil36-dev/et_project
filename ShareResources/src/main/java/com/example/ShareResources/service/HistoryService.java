package com.example.ShareResources.service;

import com.example.ShareResources.model.History;
import com.example.ShareResources.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    public History save(History history) {
        return historyRepository.save(history);
    }

    public List<History> findHistoryByUserId(String userId) {
        // In a real scenario, you'd add a custom query to HistoryRepository 
        // to filter by userId efficiently. For now, we return all.
        return historyRepository.findAll();
    }
}