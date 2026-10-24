package com.example.Warranty_Wave_Backend.dto;

import com.example.Warranty_Wave_Backend.model.ClaimStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ClaimResponse(
    String claimNumber,
    Long vehicleId,
    String vehicle,
    String issue,
    BigDecimal estimatedCost,
    ClaimStatus status,
    LocalDateTime createdAt
) {
}
