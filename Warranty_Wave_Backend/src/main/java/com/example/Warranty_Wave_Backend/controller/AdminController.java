package com.example.Warranty_Wave_Backend.controller;

import com.example.Warranty_Wave_Backend.dto.UserSummaryResponse;
import com.example.Warranty_Wave_Backend.dto.WarrantyPlanRequest;
import com.example.Warranty_Wave_Backend.dto.WarrantyPlanResponse;
import com.example.Warranty_Wave_Backend.model.AccountStatus;
import com.example.Warranty_Wave_Backend.model.UserAccount;
import com.example.Warranty_Wave_Backend.model.UserRole;
import com.example.Warranty_Wave_Backend.repository.UserRepository;
import com.example.Warranty_Wave_Backend.repository.WarrantyPlanRepository;
import com.example.Warranty_Wave_Backend.service.ClaimService;
import com.example.Warranty_Wave_Backend.service.WarrantyPlanService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository users;
    private final WarrantyPlanRepository plans;
    private final ClaimService claims;
    private final WarrantyPlanService planService;

    public AdminController(UserRepository users, WarrantyPlanRepository plans, ClaimService claims,
                           WarrantyPlanService planService) {
        this.users = users;
        this.plans = plans;
        this.claims = claims;
        this.planService = planService;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        long customers = users.countByRoleAndAccountStatus(UserRole.CUSTOMER, AccountStatus.ACTIVE);
        return Map.of("totalCustomers", customers, "activePlans", plans.countByActiveTrue(),
            "activeClaims", claims.countActive(), "serviceStatus", "Operational");
    }

    @GetMapping("/users")
    public List<UserSummaryResponse> users() {
        return users.findAllByOrderByCreatedAtDesc().stream().map(this::toSummary).toList();
    }

    @GetMapping("/plans")
    public List<WarrantyPlanResponse> plans() {
        return planService.listAll();
    }

    @PostMapping("/plans")
    public ResponseEntity<WarrantyPlanResponse> createPlan(@Valid @RequestBody WarrantyPlanRequest request) {
        WarrantyPlanResponse response = planService.create(request);
        return ResponseEntity.created(URI.create("/api/plans/" + response.id())).body(response);
    }

    private UserSummaryResponse toSummary(UserAccount account) {
        return new UserSummaryResponse(account.getId(), account.getFirstName(), account.getLastName(),
            account.getEmail(), account.getRole(), account.getAccountStatus());
    }
}
