package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.entity.PointHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {
}
