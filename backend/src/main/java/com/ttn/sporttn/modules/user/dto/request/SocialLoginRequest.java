package com.ttn.sporttn.modules.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLoginRequest {

    @NotBlank(message = "Token không được để trống")
    private String token;

    @NotBlank(message = "Provider không được để trống")
    private String provider;
}
