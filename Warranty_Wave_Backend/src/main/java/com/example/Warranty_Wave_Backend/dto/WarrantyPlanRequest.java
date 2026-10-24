package com.example.Warranty_Wave_Backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record WarrantyPlanRequest(
    @NotBlank @Size(max = 120) String name,
    @NotBlank @Size(max = 1000) String description,
    @NotNull @Positive Integer coverageDurationMonths,
    @Positive Integer coverageMileageLimit,
    @NotNull @DecimalMin("0.00") @Digits(integer = 10, fraction = 2) BigDecimal price,
    @NotBlank @Size(max = 10000) String coverageDetails,
    @Size(max = 10000) String exclusions,
    @Size(max = 1000) String eligibilityCriteria,
    Boolean active
) {
}
