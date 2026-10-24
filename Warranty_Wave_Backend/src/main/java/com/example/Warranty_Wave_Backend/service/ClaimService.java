package com.example.Warranty_Wave_Backend.service;

import com.example.Warranty_Wave_Backend.dto.ClaimRequest;
import com.example.Warranty_Wave_Backend.dto.ClaimResponse;
import com.example.Warranty_Wave_Backend.exception.ResourceNotFoundException;
import com.example.Warranty_Wave_Backend.model.ClaimStatus;
import com.example.Warranty_Wave_Backend.model.UserAccount;
import com.example.Warranty_Wave_Backend.model.Vehicle;
import com.example.Warranty_Wave_Backend.model.WarrantyClaim;
import com.example.Warranty_Wave_Backend.repository.ClaimRepository;
import com.example.Warranty_Wave_Backend.repository.UserRepository;
import com.example.Warranty_Wave_Backend.repository.VehicleRepository;
import java.util.Collection;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClaimService {
    private static final Collection<ClaimStatus> ACTIVE_STATUSES =
        java.util.List.of(ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.NEEDS_INFORMATION);

    private final ClaimRepository claims;
    private final VehicleRepository vehicles;
    private final UserRepository users;

    public ClaimService(ClaimRepository claims, VehicleRepository vehicles, UserRepository users) {
        this.claims = claims;
        this.vehicles = vehicles;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public Page<ClaimResponse> list(String email, boolean administrator, Pageable pageable) {
        UserAccount user = findUser(email);
        Page<WarrantyClaim> page = administrator
            ? claims.findAll(pageable)
            : claims.findAllByOwnerId(user.getId(), pageable);
        return page.map(this::toResponse);
    }

    @Transactional
    public ClaimResponse create(String email, ClaimRequest request) {
        UserAccount owner = findUser(email);
        Vehicle vehicle = vehicles.findByIdAndOwner_Id(request.vehicleId(), owner.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found."));
        String claimNumber = "CLM-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        WarrantyClaim claim = new WarrantyClaim(claimNumber, vehicle, request.issue().trim(), request.cost());
        return toResponse(claims.save(claim));
    }

    @Transactional
    public ClaimResponse updateStatus(Long id, ClaimStatus status) {
        WarrantyClaim claim = claims.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Claim not found."));
        claim.setStatus(status);
        return toResponse(claim);
    }

    @Transactional(readOnly = true)
    public long countActiveFor(UserAccount user) {
        return claims.countByOwnerAndStatuses(user.getId(), ACTIVE_STATUSES);
    }

    @Transactional(readOnly = true)
    public long countActive() {
        return claims.countByStatusIn(ACTIVE_STATUSES);
    }

    private UserAccount findUser(String email) {
        return users.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found."));
    }

    private ClaimResponse toResponse(WarrantyClaim claim) {
        Vehicle vehicle = claim.getVehicle();
        return new ClaimResponse(claim.getClaimNumber(), vehicle.getId(),
            vehicle.getManufacturer() + " " + vehicle.getModel() + " (" + vehicle.getRegistrationNumber() + ")",
            claim.getIssue(), claim.getEstimatedCost(), claim.getStatus(), claim.getCreatedAt());
    }
}
