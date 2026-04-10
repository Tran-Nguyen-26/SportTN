package com.ttn.sporttn.modules.user.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.user.dto.request.LoginRequest;
import com.ttn.sporttn.modules.user.dto.request.RegisterRequest;
import com.ttn.sporttn.modules.user.dto.response.AuthResponse;
import com.ttn.sporttn.modules.user.dto.response.UserDetailResponse;
import com.ttn.sporttn.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
                @Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = userService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(authResponse));
    }

    @PostMapping("/sign-up")
    public  ResponseEntity<ApiResponse<UserDetailResponse>> register(
                @Valid @RequestBody RegisterRequest request) {
        UserDetailResponse userDetailResponse = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(userDetailResponse, "Đăng ký thành công"));
    }
}
