package com.example.Warranty_Wave_Backend.repository;

import com.example.Warranty_Wave_Backend.model.AccountStatus;
import com.example.Warranty_Wave_Backend.model.UserAccount;
import com.example.Warranty_Wave_Backend.model.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    long countByRoleAndAccountStatus(UserRole role, AccountStatus accountStatus);
    List<UserAccount> findAllByOrderByCreatedAtDesc();
}
