package com.example.Warranty_Wave_Backend.dto;

import com.example.Warranty_Wave_Backend.model.AccountStatus;
import com.example.Warranty_Wave_Backend.model.UserRole;

public record UserSummaryResponse(Long id, String firstName, String lastName, String email,
                                  UserRole role, AccountStatus accountStatus) {
}
