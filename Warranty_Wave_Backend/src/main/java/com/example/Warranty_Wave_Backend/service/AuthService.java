package com.example.Warranty_Wave_Backend.service;

import com.example.Warranty_Wave_Backend.dto.AuthResponse;
import com.example.Warranty_Wave_Backend.dto.LoginRequest;
import com.example.Warranty_Wave_Backend.dto.RegisterRequest;
import com.example.Warranty_Wave_Backend.exception.ResourceConflictException;
import com.example.Warranty_Wave_Backend.model.UserAccount;
import com.example.Warranty_Wave_Backend.repository.UserRepository;
import com.example.Warranty_Wave_Backend.security.JwtTokenService;
import java.util.Locale;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService tokenService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtTokenService tokenService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @Transactional
    public void register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResourceConflictException("An account with this email already exists.");
        }
        UserAccount account = new UserAccount(request.firstName().trim(), request.lastName().trim(), email,
            passwordEncoder.encode(request.password()));
        users.save(account);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.password()));
        UserAccount user = users.findByEmailIgnoreCase(authentication.getName())
            .orElseThrow(() -> new IllegalStateException("Authenticated account was not found."));
        return new AuthResponse(tokenService.issue(user), "Bearer", user.getEmail(), user.getRole().name());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
