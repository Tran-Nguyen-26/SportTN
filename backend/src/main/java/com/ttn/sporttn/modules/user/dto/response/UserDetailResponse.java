package com.ttn.sporttn.modules.user.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserDetailResponse {
    private Long userId;
    private String email;
    private String username;
    private String phone;
    private String role;
    private String status;
    private Integer totalPoints;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
