package com.warrantywave.controller;

import com.warrantywave.exception.ResourceNotFoundException;
import com.warrantywave.model.WarrantyPlan;
import com.warrantywave.repository.WarrantyPlanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WarrantyPlanController {
    private final WarrantyPlanRepository warrantyPlanRepository;

    public WarrantyPlanController(WarrantyPlanRepository warrantyPlanRepository) {
        this.warrantyPlanRepository = warrantyPlanRepository;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<WarrantyPlan>> browsePlans() {
        return ResponseEntity.ok(warrantyPlanRepository.findByActiveTrueOrderByNameAsc());
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<WarrantyPlan> getPlan(@PathVariable Long id) {
        return ResponseEntity.ok(warrantyPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warranty plan not found with id: " + id)));
    }
}
