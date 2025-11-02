package com.example.ShareResources.controller;

import com.example.ShareResources.model.User;
import java.util.UUID;
import com.example.ShareResources.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
    	System.out.println("Registered successfully");
    	
    	if (user.getUserId() == null || user.getUserId().isEmpty()) {
    	        user.setUserId(UUID.randomUUID().toString()); // assign string ID
    	    }
        User savedUser = userService.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

//    // GET /api/users/{userId}
//    @GetMapping("/{userId}")
//    public ResponseEntity<?> getUserById(@PathVariable String userId) {
//    	System.out.println("Hello");
//        Optional<User> user = userService.findById(userId);
//        //System.out.println("Hello");
//        if (user.isPresent()) {
//            return ResponseEntity.ok(user.get());
//        } else {
//            Map<String, String> error = new HashMap<>();
//            error.put("message", "User not found");
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
//        }
//    }
//    @PostMapping("/login")
//    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
//        String email = loginData.get("email");
//        String password = loginData.get("password");
//
//        //Optional<User> userOpt = userService.findByEmail(email);
//
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            if (user.getPassword().equals(password)) {  // simple check for now
//                return ResponseEntity.ok(user);
//            } else {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("message", "Invalid password"));
//            }
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(Map.of("message", "User not found"));
//        }
//    }
    // GET /api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
 // ✅ GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<User> fetchUserDetails(@PathVariable String id) {
        Optional<User> user = userService.findById((id));
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
}