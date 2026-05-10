package com.ttn.sporttn.common.exception;

import com.ttn.sporttn.common.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex,
                                                        HttpServletRequest request) {
        return ResponseEntity.status(ex.getErrorCode().getHttpStatus())
                .body(ErrorResponse.builder()
                        .code(ex.getErrorCode().getCode())
                        .message(ex.getMessage())
                        .path(request.getRequestURI())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
                                                          HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
                .body(ErrorResponse.builder()
                        .code(HttpStatus.BAD_REQUEST.name())
                        .message(message)
                        .path(request.getRequestURI())
                        .timestamp(LocalDateTime.now())
                        .build()
                );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex,
                                                                HttpServletRequest request) {
        log.error("Runtime Exception: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.builder()
                        .code("INTERNAL_SERVER_ERROR")
                        .message(ex.getMessage())
                        .path(request.getRequestURI())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

}
