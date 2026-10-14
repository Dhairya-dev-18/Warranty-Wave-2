package com.warrantywave.controller;

import com.warrantywave.model.UserRole;
import com.warrantywave.repository.UserRepository;
import com.warrantywave.repository.WarrantyPlanRepository;
import com.warrantywave.repository.ClaimRepository;
import com.warrantywave.model.ClaimStatus;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {
    private final UserRepository userRepository;
    private final WarrantyPlanRepository warrantyPlanRepository;
    private final ClaimRepository claimRepository;

    public DashboardController(UserRepository userRepository, WarrantyPlanRepository warrantyPlanRepository, ClaimRepository claimRepository) {
        this.userRepository = userRepository;
        this.warrantyPlanRepository = warrantyPlanRepository;
        this.claimRepository = claimRepository;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','ADJUSTER','CREDIT_OFFICER')")
    public ResponseEntity<Map<String, Object>> dashboard(Authentication authentication) {
        var user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        long activeClaims = user.getRole() == UserRole.CUSTOMER
                ? claimRepository.countByClaimant_IdAndStatusIn(user.getId(), java.util.List.of(ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.NEEDS_INFORMATION))
                : claimRepository.countByStatusIn(java.util.List.of(ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.NEEDS_INFORMATION));
        return ResponseEntity.ok(Map.of(
                "customers", userRepository.countByRole(UserRole.CUSTOMER),
                "activePlans", warrantyPlanRepository.countByActiveTrue(),
                "activeClaims", activeClaims,
                "message", "Dashboard data loaded"
        ));
    }
}
