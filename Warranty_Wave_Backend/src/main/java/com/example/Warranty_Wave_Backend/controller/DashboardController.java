package com.example.Warranty_Wave_Backend.controller;

import com.example.Warranty_Wave_Backend.exception.ResourceNotFoundException;
import com.example.Warranty_Wave_Backend.model.AccountStatus;
import com.example.Warranty_Wave_Backend.model.UserAccount;
import com.example.Warranty_Wave_Backend.model.UserRole;
import com.example.Warranty_Wave_Backend.repository.UserRepository;
import com.example.Warranty_Wave_Backend.repository.WarrantyPlanRepository;
import com.example.Warranty_Wave_Backend.service.ClaimService;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final UserRepository users;
    private final WarrantyPlanRepository plans;
    private final ClaimService claims;

    public DashboardController(UserRepository users, WarrantyPlanRepository plans, ClaimService claims) {
        this.users = users;
        this.plans = plans;
        this.claims = claims;
    }

    @GetMapping
    public Map<String, Object> dashboard(Authentication authentication) {
        UserAccount user = users.findByEmailIgnoreCase(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Account not found."));
        long activeClaims = user.getRole() == UserRole.ADMIN
            ? claims.countActive()
            : claims.countActiveFor(user);
        return Map.of(
            "customers", users.countByRoleAndAccountStatus(UserRole.CUSTOMER, AccountStatus.ACTIVE),
            "activePlans", plans.countByActiveTrue(),
            "activeClaims", activeClaims,
            "message", "Dashboard data loaded"
        );
    }
}
