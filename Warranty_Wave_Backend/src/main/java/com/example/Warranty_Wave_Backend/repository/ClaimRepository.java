package com.example.Warranty_Wave_Backend.repository;

import com.example.Warranty_Wave_Backend.model.ClaimStatus;
import com.example.Warranty_Wave_Backend.model.WarrantyClaim;
import java.util.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClaimRepository extends JpaRepository<WarrantyClaim, Long> {
    @Query("select c from WarrantyClaim c where c.vehicle.owner.id = :ownerId")
    Page<WarrantyClaim> findAllByOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);

    long countByStatusIn(Collection<ClaimStatus> statuses);

    @Query("select count(c) from WarrantyClaim c where c.vehicle.owner.id = :ownerId and c.status in :statuses")
    long countByOwnerAndStatuses(@Param("ownerId") Long ownerId,
                                 @Param("statuses") Collection<ClaimStatus> statuses);
}
