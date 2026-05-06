package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.dto.response.admin.ActivityLogResponse;
import com.ttn.sporttn.modules.user.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserId(Long adminId);
}
