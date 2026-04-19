package com.ttn.sporttn.modules.user.dto.response;

import com.ttn.sporttn.modules.user.entity.AuthProvider;
import com.ttn.sporttn.modules.user.entity.UserRole;
import com.ttn.sporttn.modules.user.entity.UserStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private Integer totalPoints;
    private AuthProvider provider;
}
