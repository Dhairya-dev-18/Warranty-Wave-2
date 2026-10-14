package com.warrantywave.dto;

import com.warrantywave.model.Claim;
import com.warrantywave.model.ClaimStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ClaimResponse(Long id, String claimNumber, Long vehicleId, String vehicle,
                            String issue, BigDecimal estimatedCost, ClaimStatus status,
                            LocalDateTime createdAt) {
    public static ClaimResponse from(Claim claim) {
        var vehicle = claim.getVehicle();
        return new ClaimResponse(claim.getId(), claim.getClaimNumber(), vehicle.getId(),
                vehicle.getManufacturer() + " " + vehicle.getModel() + " (" + vehicle.getRegistrationNumber() + ")",
                claim.getIssueDescription(), claim.getEstimatedCost(), claim.getStatus(), claim.getCreatedAt());
    }
}
