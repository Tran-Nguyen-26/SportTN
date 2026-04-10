package com.ttn.sporttn.common.dto;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@RequiredArgsConstructor
public class ErrorResponse {
    private final String code;
    private final String message;
    private final String path;
    private final LocalDateTime timestamp;
}
