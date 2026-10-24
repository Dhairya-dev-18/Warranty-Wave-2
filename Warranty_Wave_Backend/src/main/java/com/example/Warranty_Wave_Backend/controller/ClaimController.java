package com.example.Warranty_Wave_Backend.controller;

import com.example.Warranty_Wave_Backend.dto.ClaimRequest;
import com.example.Warranty_Wave_Backend.dto.ClaimResponse;
import com.example.Warranty_Wave_Backend.dto.ClaimStatusRequest;
import com.example.Warranty_Wave_Backend.service.ClaimService;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {
    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public Page<ClaimResponse> list(Authentication authentication,
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        boolean administrator = authentication.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        return claimService.list(authentication.getName(), administrator, pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ClaimResponse> create(Authentication authentication,
                                                   @Valid @RequestBody ClaimRequest request) {
        ClaimResponse response = claimService.create(authentication.getName(), request);
        return ResponseEntity.created(URI.create("/api/claims/" + response.claimNumber())).body(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ClaimResponse updateStatus(@PathVariable Long id, @Valid @RequestBody ClaimStatusRequest request) {
        return claimService.updateStatus(id, request.status());
    }
}
