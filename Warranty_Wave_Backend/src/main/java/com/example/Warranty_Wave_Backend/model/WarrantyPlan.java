package com.example.Warranty_Wave_Backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "warranty_plans")
public class WarrantyPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "coverage_duration_months", nullable = false)
    private int coverageDurationMonths;

    @Column(name = "coverage_mileage_limit")
    private Integer coverageMileageLimit;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "coverage_details", nullable = false, columnDefinition = "TEXT")
    private String coverageDetails;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String exclusions;

    @Column(name = "eligibility_criteria", nullable = false, length = 1000)
    private String eligibilityCriteria;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected WarrantyPlan() {
    }

    public WarrantyPlan(String name, String description, int coverageDurationMonths, Integer coverageMileageLimit,
                        BigDecimal price, String coverageDetails, String exclusions, String eligibilityCriteria,
                        boolean active) {
        this.name = name;
        this.description = description;
        this.coverageDurationMonths = coverageDurationMonths;
        this.coverageMileageLimit = coverageMileageLimit;
        this.price = price;
        this.coverageDetails = coverageDetails;
        this.exclusions = exclusions;
        this.eligibilityCriteria = eligibilityCriteria;
        this.active = active;
    }

    @PrePersist
    void setCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public int getCoverageDurationMonths() { return coverageDurationMonths; }
    public Integer getCoverageMileageLimit() { return coverageMileageLimit; }
    public BigDecimal getPrice() { return price; }
    public String getCoverageDetails() { return coverageDetails; }
    public String getExclusions() { return exclusions; }
    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public boolean isActive() { return active; }
}
