package com.warrantywave.controller;

import com.warrantywave.dto.ClaimRequest;
import com.warrantywave.dto.ClaimResponse;
import com.warrantywave.exception.ResourceNotFoundException;
import com.warrantywave.model.*;
import com.warrantywave.repository.ClaimRepository;
import com.warrantywave.repository.UserRepository;
import com.warrantywave.repository.VehicleRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {
    private final ClaimRepository claims;
    private final VehicleRepository vehicles;
    private final UserRepository users;

    public ClaimController(ClaimRepository claims, VehicleRepository vehicles, UserRepository users) {
        this.claims = claims; this.vehicles = vehicles; this.users = users;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','ADJUSTER')")
    @Transactional(readOnly = true)
    public Page<ClaimResponse> list(Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (page < 0 || size < 1 || size > 100) throw new IllegalArgumentException("page must be non-negative and size must be between 1 and 100");
        User user = user(auth);
        Page<Claim> result = user.getRole() == UserRole.CUSTOMER
                ? claims.findByClaimant_IdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size))
                : claims.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return result.map(ClaimResponse::from);
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Transactional
    public ResponseEntity<ClaimResponse> create(Authentication auth, @Valid @RequestBody ClaimRequest request) {
        User user = user(auth);
        Vehicle vehicle = vehicles.findById(request.vehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        if (!vehicle.getOwner().getId().equals(user.getId()))
            throw new org.springframework.security.access.AccessDeniedException("Vehicle does not belong to the current user");
        Claim claim = new Claim();
        claim.setClaimant(user); claim.setVehicle(vehicle);
        claim.setIssueDescription(request.issueDescription().trim());
        claim.setEstimatedCost(request.estimatedCost());
        claim.setClaimNumber("WW-CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return ResponseEntity.status(HttpStatus.CREATED).body(ClaimResponse.from(claims.save(claim)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','ADJUSTER')")
    @Transactional
    public ClaimResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Claim claim = claims.findById(id).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        try { claim.setStatus(ClaimStatus.valueOf(body.getOrDefault("status", "").toUpperCase())); }
        catch (IllegalArgumentException ex) { throw new IllegalArgumentException("A valid claim status is required"); }
        return ClaimResponse.from(claims.save(claim));
    }

    private User user(Authentication auth) {
        return users.findByEmail(auth.getName()).orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
