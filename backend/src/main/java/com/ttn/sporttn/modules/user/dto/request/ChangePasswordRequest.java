package com.ttn.sporttn.modules.user.dto.request;

import lombok.Getter;

@Getter
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
