package com.example.Warranty_Wave_Backend.security;

import com.example.Warranty_Wave_Backend.model.AccountStatus;
import com.example.Warranty_Wave_Backend.model.UserAccount;
import com.example.Warranty_Wave_Backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository users;

    public CustomUserDetailsService(UserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserAccount account = users.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
        return org.springframework.security.core.userdetails.User.withUsername(account.getEmail())
            .password(account.getPasswordHash())
            .roles(account.getRole().name())
            .disabled(account.getAccountStatus() != AccountStatus.ACTIVE)
            .build();
    }
}
