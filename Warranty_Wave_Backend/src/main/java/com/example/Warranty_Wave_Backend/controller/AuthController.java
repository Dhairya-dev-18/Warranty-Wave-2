package com.example.Warranty_Wave_Backend.controller;

import com.example.Warranty_Wave_Backend.dto.AuthResponse;
import com.example.Warranty_Wave_Backend.dto.LoginRequest;
import com.example.Warranty_Wave_Backend.dto.MessageResponse;
import com.example.Warranty_Wave_Backend.dto.RegisterRequest;
import com.example.Warranty_Wave_Backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Account created successfully."));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
