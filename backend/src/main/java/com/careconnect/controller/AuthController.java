package com.careconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String role = credentials.getOrDefault("role", "patient");

        Map<String, Object> user = new HashMap<>();
        user.put("id", "usr-" + System.currentTimeMillis());
        user.put("email", email);
        user.put("role", role);
        user.put("name", email.contains("@") ? email.split("@")[0].replace(".", " ") : "Demo User");

        Map<String, Object> response = new HashMap<>();
        response.put("token", "jwt-careconnect-token-" + System.currentTimeMillis());
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        userData.put("id", "usr-" + System.currentTimeMillis());
        response.put("token", "jwt-careconnect-register-" + System.currentTimeMillis());
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }
}
