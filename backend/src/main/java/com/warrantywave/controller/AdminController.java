package com.warrantywave.controller;

import com.warrantywave.model.UserRole;
import com.warrantywave.model.User;
import com.warrantywave.model.WarrantyPlan;
import com.warrantywave.repository.UserRepository;
import com.warrantywave.repository.WarrantyPlanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository userRepository;
    private final WarrantyPlanRepository warrantyPlanRepository;

    public AdminController(UserRepository userRepository, WarrantyPlanRepository warrantyPlanRepository) {
        this.userRepository = userRepository;
        this.warrantyPlanRepository = warrantyPlanRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> users() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/plans")
    public ResponseEntity<List<WarrantyPlan>> plans() {
        return ResponseEntity.ok(warrantyPlanRepository.findAll());
    }

    @PostMapping("/plans")
    public ResponseEntity<?> addPlan(@jakarta.validation.Valid @RequestBody WarrantyPlan plan) {
        return ResponseEntity.ok(warrantyPlanRepository.save(plan));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        long customers = userRepository.countByRole(UserRole.CUSTOMER);
        long activePlans = warrantyPlanRepository.countByActiveTrue();
        return ResponseEntity.ok(Map.of(
                "totalCustomers", customers,
                "activePlans", activePlans
        ));
    }
}
