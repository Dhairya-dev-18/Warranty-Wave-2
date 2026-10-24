package com.example.Warranty_Wave_Backend.dto;

import com.example.Warranty_Wave_Backend.model.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public record ClaimStatusRequest(@NotNull ClaimStatus status) {
}
