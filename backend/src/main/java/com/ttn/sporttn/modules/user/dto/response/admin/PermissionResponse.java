package com.ttn.sporttn.modules.user.dto.response.admin;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PermissionResponse {
    private Long id;
    private String name;
    private String value;
    private String description;
}


