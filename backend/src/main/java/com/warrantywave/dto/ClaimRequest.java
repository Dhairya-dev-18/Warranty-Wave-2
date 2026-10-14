package com.warrantywave.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ClaimRequest(@NotNull Long vehicleId,
                           @NotBlank @Size(max = 2000) String issueDescription,
                           @NotNull @DecimalMin("0.01") BigDecimal estimatedCost) {}
