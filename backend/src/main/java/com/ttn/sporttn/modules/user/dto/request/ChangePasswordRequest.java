package com.ttn.sporttn.modules.user.dto.request;

import lombok.Getter;

@Getter
public class ChangePasswordRequest {
    private String email;
    private String newPassword;
}
