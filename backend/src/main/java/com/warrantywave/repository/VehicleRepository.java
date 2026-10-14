package com.warrantywave.repository;

import com.warrantywave.model.User;
import com.warrantywave.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByOwner(User owner);
    List<Vehicle> findByOwner_Id(Long ownerId);
    boolean existsByRegistrationNumberAndOwner_Id(String registrationNumber, Long ownerId);
    boolean existsByVinAndOwner_Id(String vin, Long ownerId);
    boolean existsByRegistrationNumber(String registrationNumber);
    boolean existsByVin(String vin);
}
