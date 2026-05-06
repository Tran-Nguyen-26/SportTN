package com.ttn.sporttn.modules.user.dto.request.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.List;

@Getter
public class AdminUserCreateRequest {

    @NotBlank(message = "Tên không được để trống")
    private String username;

    private String fullname;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu tối thiểu 8 ký tự")
    private String password;

    private String phone;

    @NotBlank(message = "Vai trò không được để trống")
    private String role; // SUPER_ADMIN | ADMIN | STAFF | WAREHOUSE

    private List<Long> permissionIds;

    private String status;

    private String avatarColor;
}


