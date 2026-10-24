package com.example.Warranty_Wave_Backend.controller;

import com.example.Warranty_Wave_Backend.dto.WarrantyPlanResponse;
import com.example.Warranty_Wave_Backend.service.WarrantyPlanService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plans")
public class WarrantyPlanController {
    private final WarrantyPlanService planService;

    public WarrantyPlanController(WarrantyPlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public List<WarrantyPlanResponse> browse() {
        return planService.browseActive();
    }

    @GetMapping("/{id}")
    public WarrantyPlanResponse get(@PathVariable Long id) {
        return planService.get(id);
    }
}
