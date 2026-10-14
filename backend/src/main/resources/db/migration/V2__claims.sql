CREATE TABLE claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_number VARCHAR(24) NOT NULL UNIQUE,
    vehicle_id BIGINT NOT NULL,
    claimant_id BIGINT NOT NULL,
    issue_description VARCHAR(2000) NOT NULL,
    estimated_cost DECIMAL(19,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_claim_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT fk_claimant FOREIGN KEY (claimant_id) REFERENCES users(id),
    CONSTRAINT chk_claim_estimated_cost CHECK (estimated_cost > 0)
);

CREATE INDEX idx_claims_claimant_created ON claims(claimant_id, created_at);
CREATE INDEX idx_claims_status_created ON claims(status, created_at);
