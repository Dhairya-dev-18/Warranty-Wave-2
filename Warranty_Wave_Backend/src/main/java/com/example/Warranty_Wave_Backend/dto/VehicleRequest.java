package com.example.Warranty_Wave_Backend.dto;

import com.example.Warranty_Wave_Backend.model.FuelType;
import com.example.Warranty_Wave_Backend.model.VehicleCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record VehicleRequest(
    @NotBlank @Size(max = 120) String manufacturer,
    @NotBlank @Size(max = 120) String model,
    @NotNull @Min(1980) @Max(2100) Integer manufactureYear,
    @NotNull VehicleCategory category,
    @NotNull FuelType fuelType,
    @NotBlank @Size(max = 80) String registrationNumber,
    @NotBlank @Pattern(regexp = "(?i)^[A-HJ-NPR-Z0-9]{17}$") String vin,
    @NotNull @Min(0) Integer odometerReading,
    @Size(max = 80) String color
) {
}
