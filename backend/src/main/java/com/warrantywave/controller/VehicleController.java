package com.warrantywave.controller;

import com.warrantywave.exception.ResourceNotFoundException;
import com.warrantywave.model.User;
import com.warrantywave.model.Vehicle;
import com.warrantywave.repository.UserRepository;
import com.warrantywave.repository.VehicleRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class VehicleController {
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleController(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/vehicles")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Vehicle>> myVehicles(Authentication authentication) {
        User user = findCurrentUser(authentication);
        return ResponseEntity.ok(vehicleRepository.findByOwner(user));
    }

    @PostMapping("/vehicles")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addVehicle(Authentication authentication, @Valid @RequestBody Vehicle vehicle) {
        User user = findCurrentUser(authentication);
        if (vehicleRepository.existsByRegistrationNumberAndOwner_Id(vehicle.getRegistrationNumber(), user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vehicle registration number already exists for this user"));
        }
        if (vehicleRepository.existsByVinAndOwner_Id(vehicle.getVin(), user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "VIN already exists for this user"));
        }
        vehicle.setOwner(user);
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    @GetMapping("/vehicles/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getVehicle(Authentication authentication, @PathVariable Long id) {
        User user = findCurrentUser(authentication);
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        if (!vehicle.getOwner().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        return ResponseEntity.ok(vehicle);
    }

    private User findCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
