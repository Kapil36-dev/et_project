package com.example.ShareResources.service;

import com.example.ShareResources.model.User;

import com.example.ShareResources.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User save(User user) {
        // In a real application, you would hash the user.password here before saving.
        return userRepository.save(user);
    }

    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }
    

    public List<User> findAll() {
        return userRepository.findAll();
    }
}