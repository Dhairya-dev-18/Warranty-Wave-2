package com.warrantywave.repository;

import com.warrantywave.model.WarrantyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WarrantyPlanRepository extends JpaRepository<WarrantyPlan, Long> {
    List<WarrantyPlan> findByActiveTrueOrderByNameAsc();
    long countByActiveTrue();
}
