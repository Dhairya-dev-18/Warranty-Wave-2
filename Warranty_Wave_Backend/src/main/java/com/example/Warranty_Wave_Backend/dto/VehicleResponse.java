package com.example.Warranty_Wave_Backend.dto;

import com.example.Warranty_Wave_Backend.model.FuelType;
import com.example.Warranty_Wave_Backend.model.VehicleCategory;

public record VehicleResponse(
    Long id,
    String registrationNumber,
    String vin,
    String manufacturer,
    String model,
    int manufactureYear,
    VehicleCategory category,
    FuelType fuelType,
    int odometerReading,
    String color
) {
}
