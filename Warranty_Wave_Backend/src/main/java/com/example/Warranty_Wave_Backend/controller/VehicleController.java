package com.example.Warranty_Wave_Backend.controller;

import com.example.Warranty_Wave_Backend.dto.VehicleRequest;
import com.example.Warranty_Wave_Backend.dto.VehicleResponse;
import com.example.Warranty_Wave_Backend.service.VehicleService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehicles")
@PreAuthorize("hasRole('CUSTOMER')")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public List<VehicleResponse> list(Authentication authentication) {
        return vehicleService.list(authentication.getName());
    }

    @GetMapping("/{id}")
    public VehicleResponse get(Authentication authentication, @PathVariable Long id) {
        return vehicleService.get(authentication.getName(), id);
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> create(Authentication authentication,
                                                   @Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.create(authentication.getName(), request);
        return ResponseEntity.created(URI.create("/api/vehicles/" + response.id())).body(response);
    }
}
