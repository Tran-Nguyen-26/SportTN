package com.ttn.sporttn.modules.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegisterRequest {

    @Email(message = "email không đúng định dạng")
    @NotBlank(message = "email không được để trống")
    private String email;

    @NotBlank(message = "username không được để trống")
    private String username;

    @NotBlank(message = "phone không được để trống")
    private String phone;

    @NotBlank
    @Size(min = 8, message = "Mật khẩu phải có tối thiểu 8 ký tự")
    private String password;
}
