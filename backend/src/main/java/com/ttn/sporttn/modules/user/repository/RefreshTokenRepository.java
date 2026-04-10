package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
}
