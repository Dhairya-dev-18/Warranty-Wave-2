package com.example.Warranty_Wave_Backend.repository;

import com.example.Warranty_Wave_Backend.model.WarrantyPlan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarrantyPlanRepository extends JpaRepository<WarrantyPlan, Long> {
    List<WarrantyPlan> findAllByActiveTrueOrderByIdAsc();
    List<WarrantyPlan> findAllByOrderByIdAsc();
    Optional<WarrantyPlan> findByIdAndActiveTrue(Long id);
    long countByActiveTrue();
}
