package com.example.Warranty_Wave_Backend.dto;

import java.math.BigDecimal;

public record WarrantyPlanResponse(
    Long id,
    String name,
    String description,
    int coverageDurationMonths,
    Integer coverageMileageLimit,
    BigDecimal price,
    String coverageDetails,
    String exclusions,
    String eligibilityCriteria,
    boolean active
) {
}
