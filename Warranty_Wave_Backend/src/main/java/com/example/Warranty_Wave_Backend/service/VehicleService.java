package com.example.Warranty_Wave_Backend.service;

import com.example.Warranty_Wave_Backend.dto.VehicleRequest;
import com.example.Warranty_Wave_Backend.dto.VehicleResponse;
import com.example.Warranty_Wave_Backend.exception.ResourceConflictException;
import com.example.Warranty_Wave_Backend.exception.ResourceNotFoundException;
import com.example.Warranty_Wave_Backend.model.UserAccount;
import com.example.Warranty_Wave_Backend.model.Vehicle;
import com.example.Warranty_Wave_Backend.repository.UserRepository;
import com.example.Warranty_Wave_Backend.repository.VehicleRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VehicleService {
    private final VehicleRepository vehicles;
    private final UserRepository users;

    public VehicleService(VehicleRepository vehicles, UserRepository users) {
        this.vehicles = vehicles;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> list(String email) {
        UserAccount owner = findUser(email);
        return vehicles.findAllByOwner_IdOrderByIdDesc(owner.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public VehicleResponse create(String email, VehicleRequest request) {
        UserAccount owner = findUser(email);
        String vin = request.vin().trim().toUpperCase(Locale.ROOT);
        String registration = request.registrationNumber().trim().toUpperCase(Locale.ROOT);
        if (vehicles.existsByVinIgnoreCase(vin) || vehicles.existsByRegistrationNumberIgnoreCase(registration)) {
            throw new ResourceConflictException("A vehicle with this VIN or registration number already exists.");
        }
        Vehicle vehicle = new Vehicle(owner, registration, vin, request.manufacturer().trim(), request.model().trim(),
            request.manufactureYear(), request.category(), request.fuelType(), request.odometerReading(),
            request.color() == null || request.color().isBlank() ? "Unspecified" : request.color().trim());
        return toResponse(vehicles.save(vehicle));
    }

    @Transactional(readOnly = true)
    public VehicleResponse get(String email, Long id) {
        UserAccount owner = findUser(email);
        Vehicle vehicle = vehicles.findByIdAndOwner_Id(id, owner.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found."));
        return toResponse(vehicle);
    }

    private UserAccount findUser(String email) {
        return users.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found."));
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(vehicle.getId(), vehicle.getRegistrationNumber(), vehicle.getVin(),
            vehicle.getManufacturer(), vehicle.getModel(), vehicle.getManufactureYear(), vehicle.getCategory(),
            vehicle.getFuelType(), vehicle.getOdometerReading(), vehicle.getColor());
    }
}
