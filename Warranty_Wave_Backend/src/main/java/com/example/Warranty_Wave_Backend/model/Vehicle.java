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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles", uniqueConstraints = {
    @UniqueConstraint(name = "uk_vehicles_registration", columnNames = "registration_number"),
    @UniqueConstraint(name = "uk_vehicles_vin", columnNames = "vin")
})
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private UserAccount owner;

    @Column(name = "registration_number", nullable = false, length = 80)
    private String registrationNumber;

    @Column(nullable = false, length = 17)
    private String vin;

    @Column(nullable = false, length = 120)
    private String manufacturer;

    @Column(nullable = false, length = 120)
    private String model;

    @Column(name = "manufacture_year", nullable = false)
    private int manufactureYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VehicleCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false, length = 20)
    private FuelType fuelType;

    @Column(name = "odometer_reading", nullable = false)
    private int odometerReading;

    @Column(nullable = false, length = 80)
    private String color;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Vehicle() {
    }

    public Vehicle(UserAccount owner, String registrationNumber, String vin, String manufacturer, String model,
                   int manufactureYear, VehicleCategory category, FuelType fuelType, int odometerReading, String color) {
        this.owner = owner;
        this.registrationNumber = registrationNumber;
        this.vin = vin;
        this.manufacturer = manufacturer;
        this.model = model;
        this.manufactureYear = manufactureYear;
        this.category = category;
        this.fuelType = fuelType;
        this.odometerReading = odometerReading;
        this.color = color;
    }

    @PrePersist
    void setCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public UserAccount getOwner() { return owner; }
    public String getRegistrationNumber() { return registrationNumber; }
    public String getVin() { return vin; }
    public String getManufacturer() { return manufacturer; }
    public String getModel() { return model; }
    public int getManufactureYear() { return manufactureYear; }
    public VehicleCategory getCategory() { return category; }
    public FuelType getFuelType() { return fuelType; }
    public int getOdometerReading() { return odometerReading; }
    public String getColor() { return color; }
}
