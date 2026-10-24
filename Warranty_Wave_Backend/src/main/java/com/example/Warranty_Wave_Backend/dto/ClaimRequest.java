package com.example.Warranty_Wave_Backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ClaimRequest(
    @NotNull @Positive Long vehicleId,
    @NotBlank @Size(min = 10, max = 2000) String issue,
    @NotNull @DecimalMin("0.01") @Digits(integer = 10, fraction = 2) BigDecimal cost
) {
}
