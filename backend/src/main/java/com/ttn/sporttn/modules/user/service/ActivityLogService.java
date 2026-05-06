package com.ttn.sporttn.modules.user.service;

import com.ttn.sporttn.modules.user.dto.response.admin.ActivityLogResponse;
import com.ttn.sporttn.modules.user.entity.ActivityLog;
import com.ttn.sporttn.modules.user.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public List<ActivityLogResponse> getLogsByAdminId(Long adminId) {
        return activityLogRepository.findByUserId(adminId)
                .stream()
                .map(this::toLogResponse)
                .toList();
    }

    private ActivityLogResponse toLogResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .type(log.getType())
                .action(log.getAction())
                .time(log.getCreatedAt())
                .build();
    }
}
