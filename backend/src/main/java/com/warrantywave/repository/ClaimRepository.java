package com.warrantywave.repository;

import com.warrantywave.model.Claim;
import com.warrantywave.model.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Page<Claim> findByClaimant_IdOrderByCreatedAtDesc(Long claimantId, Pageable pageable);
    Page<Claim> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByClaimant_IdAndStatusIn(Long claimantId, java.util.Collection<ClaimStatus> statuses);
    long countByStatusIn(java.util.Collection<ClaimStatus> statuses);
}
