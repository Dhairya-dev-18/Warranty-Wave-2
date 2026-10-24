package com.example.Warranty_Wave_Backend.repository;

import com.example.Warranty_Wave_Backend.model.Vehicle;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findAllByOwner_IdOrderByIdDesc(Long ownerId);
    Optional<Vehicle> findByIdAndOwner_Id(Long id, Long ownerId);
    boolean existsByVinIgnoreCase(String vin);
    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);
}
