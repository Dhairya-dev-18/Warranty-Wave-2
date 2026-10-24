CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    account_status VARCHAR(20) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE vehicles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    owner_id BIGINT NOT NULL,
    registration_number VARCHAR(80) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    manufacturer VARCHAR(120) NOT NULL,
    model VARCHAR(120) NOT NULL,
    manufacture_year INT NOT NULL,
    category VARCHAR(20) NOT NULL,
    fuel_type VARCHAR(20) NOT NULL,
    odometer_reading INT NOT NULL,
    color VARCHAR(80) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_vehicles_registration UNIQUE (registration_number),
    CONSTRAINT uk_vehicles_vin UNIQUE (vin),
    CONSTRAINT fk_vehicles_owner FOREIGN KEY (owner_id) REFERENCES users (id),
    INDEX idx_vehicles_owner (owner_id)
) ENGINE=InnoDB;

CREATE TABLE warranty_plans (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    coverage_duration_months INT NOT NULL,
    coverage_mileage_limit INT NULL,
    price DECIMAL(12, 2) NOT NULL,
    coverage_details TEXT NOT NULL,
    exclusions TEXT NOT NULL,
    eligibility_criteria VARCHAR(1000) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_warranty_plans_active (active)
) ENGINE=InnoDB;

CREATE TABLE claims (
    id BIGINT NOT NULL AUTO_INCREMENT,
    claim_number VARCHAR(40) NOT NULL,
    vehicle_id BIGINT NOT NULL,
    issue VARCHAR(2000) NOT NULL,
    estimated_cost DECIMAL(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_claims_number UNIQUE (claim_number),
    CONSTRAINT fk_claims_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    INDEX idx_claims_vehicle_created (vehicle_id, created_at)
) ENGINE=InnoDB;
