package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.entity.User;
import com.ttn.sporttn.modules.user.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByPhone(String phone);
    long countByRoleAndCreatedAtBetween(UserRole role, LocalDateTime from, LocalDateTime to);
}
