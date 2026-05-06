package com.ttn.sporttn.modules.user.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminUserResponse {

    private Long id;
    private String username;
    private String fullname;
    private String email;
    private String phone;

    private String role; // SUPER_ADMIN, ADMIN, STAFF, WAREHOUSE
    private List<PermissionResponse> permissions;

    private String status;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime lastLogin;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime createdAt;

    private String avatarColor;
    private Boolean isCurrentUser;
    private Long actionCount;
    private String device;
    private List<ActivityLogResponse> activityLog;
}
