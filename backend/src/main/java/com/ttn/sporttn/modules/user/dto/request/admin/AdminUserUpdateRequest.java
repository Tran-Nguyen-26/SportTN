package com.ttn.sporttn.modules.user.dto.request.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.List;

@Getter
public class AdminUserUpdateRequest {

    @NotBlank(message = "Tên không được để trống")
    private String username;

    private String fullname;

    private String phone;

    @NotBlank(message = "Vai trò không được để trống")
    private String role;

    private List<Long> permissionIds;

    private String status;
}
