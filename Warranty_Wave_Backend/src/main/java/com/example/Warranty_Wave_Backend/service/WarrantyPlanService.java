package com.example.Warranty_Wave_Backend.service;

import com.example.Warranty_Wave_Backend.dto.WarrantyPlanRequest;
import com.example.Warranty_Wave_Backend.dto.WarrantyPlanResponse;
import com.example.Warranty_Wave_Backend.exception.ResourceNotFoundException;
import com.example.Warranty_Wave_Backend.model.WarrantyPlan;
import com.example.Warranty_Wave_Backend.repository.WarrantyPlanRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WarrantyPlanService {
    private final WarrantyPlanRepository plans;

    public WarrantyPlanService(WarrantyPlanRepository plans) {
        this.plans = plans;
    }

    @Transactional(readOnly = true)
    public List<WarrantyPlanResponse> browseActive() {
        return plans.findAllByActiveTrueOrderByIdAsc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public WarrantyPlanResponse get(Long id) {
        return plans.findByIdAndActiveTrue(id).map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Warranty plan not found."));
    }

    @Transactional(readOnly = true)
    public List<WarrantyPlanResponse> listAll() {
        return plans.findAllByOrderByIdAsc().stream().map(this::toResponse).toList();
    }

    @Transactional
    public WarrantyPlanResponse create(WarrantyPlanRequest request) {
        WarrantyPlan plan = new WarrantyPlan(request.name().trim(), request.description().trim(),
            request.coverageDurationMonths(), request.coverageMileageLimit(), request.price(),
            request.coverageDetails().trim(), emptyIfNull(request.exclusions()),
            request.eligibilityCriteria() == null ? "Standard certified vehicles" : request.eligibilityCriteria().trim(),
            request.active() == null || request.active());
        return toResponse(plans.save(plan));
    }

    private WarrantyPlanResponse toResponse(WarrantyPlan plan) {
        return new WarrantyPlanResponse(plan.getId(), plan.getName(), plan.getDescription(),
            plan.getCoverageDurationMonths(), plan.getCoverageMileageLimit(), plan.getPrice(),
            plan.getCoverageDetails(), plan.getExclusions(), plan.getEligibilityCriteria(), plan.isActive());
    }

    private String emptyIfNull(String value) {
        return value == null ? "" : value.trim();
    }
}
