package com.example.ShareResources.service;

import com.example.ShareResources.model.ReturnStatus;
import com.example.ShareResources.model.ItemStatus;
import com.example.ShareResources.model.Return;
import com.example.ShareResources.repository.ItemRepository;
import com.example.ShareResources.repository.ReturnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReturnService {

    @Autowired
    private ReturnRepository returnRepository;

    @Autowired
    private ItemRepository itemRepository;

    // Borrower Action: Initiates the return process
    public Return initiateReturn(String itemId, String borrowerId) {
        return itemRepository.findById(itemId)
            .map(item -> {
                // Check if the item is currently BOOKED (or accepted)
                if (item.getStatus() != ItemStatus.BOOKED) {
                    return null; // Item not in a state to be returned
                }
                
                // 1. Create the Return record and set status to INITIATED
                Return itemReturn = new Return();
                itemReturn.setItemId(itemId);
                itemReturn.setBorrowerId(borrowerId);
                itemReturn.setReturnStatus(ReturnStatus.INITIATED);
                Return savedReturn = returnRepository.save(itemReturn);

                // 2. CRITICAL: Update the item status to PENDING_RETURN
                item.setStatus(ItemStatus.PENDING_RETURN);
                itemRepository.save(item);
                
                return savedReturn;
            })
            .orElse(null);
    }

    // Service Provider Action: Completes the return
    public Optional<Return> completeReturn(String returnId) {
        return returnRepository.findById(returnId).map(itemReturn -> {

            // 1. Set the return status to COMPLETED
            itemReturn.setReturnStatus(ReturnStatus.COMPLETED);
            Return completedReturn = returnRepository.save(itemReturn);

            // 2. CRITICAL: Set the item status back to AVAILABLE (End of the cycle)
            itemRepository.findById(itemReturn.getItemId()).ifPresent(item -> {
                item.setStatus(ItemStatus.AVAILABLE);
                itemRepository.save(item);
            });

            return completedReturn;
        });
    }
}