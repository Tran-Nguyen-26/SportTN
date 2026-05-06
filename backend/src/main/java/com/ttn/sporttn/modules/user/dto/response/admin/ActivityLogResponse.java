package com.ttn.sporttn.modules.user.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {

    private String type; // create, edit, delete, login, order
    private String action;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime time;
}
