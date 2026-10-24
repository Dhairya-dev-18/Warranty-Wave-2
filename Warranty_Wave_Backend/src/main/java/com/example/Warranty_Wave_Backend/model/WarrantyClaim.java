package com.example.Warranty_Wave_Backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims", uniqueConstraints = @UniqueConstraint(name = "uk_claims_number", columnNames = "claim_number"))
public class WarrantyClaim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "claim_number", nullable = false, length = 40)
    private String claimNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false, length = 2000)
    private String issue;

    @Column(name = "estimated_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ClaimStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected WarrantyClaim() {
    }

    public WarrantyClaim(String claimNumber, Vehicle vehicle, String issue, BigDecimal estimatedCost) {
        this.claimNumber = claimNumber;
        this.vehicle = vehicle;
        this.issue = issue;
        this.estimatedCost = estimatedCost;
        this.status = ClaimStatus.SUBMITTED;
    }

    @PrePersist
    void setCreatedAt() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    void setUpdatedAt() {
        updatedAt = LocalDateTime.now();
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public Long getId() { return id; }
    public String getClaimNumber() { return claimNumber; }
    public Vehicle getVehicle() { return vehicle; }
    public String getIssue() { return issue; }
    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public ClaimStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
