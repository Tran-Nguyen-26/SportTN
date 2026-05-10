package com.ttn.sporttn.modules.user.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.user.dto.request.*;
import com.ttn.sporttn.modules.user.dto.response.AuthResponse;
import com.ttn.sporttn.modules.user.dto.response.UserDetailResponse;
import com.ttn.sporttn.modules.user.service.CustomerService;
import com.ttn.sporttn.modules.user.service.SocialAuthService;
import com.ttn.sporttn.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final SocialAuthService socialAuthService;
    private final CustomerService customerService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
                @Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = userService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(authResponse));
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(
                @Valid @RequestBody SocialLoginRequest request) {
        try {
            log.info("OAuth Controller");
            AuthResponse authResponse;
            if ("GOOGLE".equalsIgnoreCase(request.getProvider())) {
                authResponse = socialAuthService.loginGoogle(request.getToken());
            } else if ("FACEBOOK".equalsIgnoreCase(request.getProvider())) {
                authResponse = socialAuthService.loginFacebook(request.getToken());
            } else {
                log.error("[AUTH] Provider không hợp lệ: {}", request.getProvider());
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(ApiResponse.ok(authResponse));
        } catch (Exception e) {
            log.error("Error OAuth, ", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse<Void>> register(
                @Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đăng ký thành công"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequest request) {
        userService.logout(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(@RequestParam String email) {
        log.info("[AUTH] Kiểm tra sự tồn tại của email: {}", email);
        boolean exists = userService.existsByEmail(email);

        return ResponseEntity.ok(ApiResponse.ok(exists, exists ? "Email đã tồn tại" : "Email khả dụng"));
    }

    // POST /api/v1/auth/forgot-password/send-otp
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        log.info("[FORGOT_PASSWORD] Gửi OTP. email={}", request.getEmail());
        customerService.sendOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("Mã OTP đã được gửi đến email của bạn"));
    }

    // POST /api/v1/auth/forgot-password/verify-otp
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        log.info("[FORGOT_PASSWORD] Verify OTP. email={}", request.getEmail());
        customerService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(ApiResponse.ok("OTP hợp lệ"));
    }

    // POST /api/v1/auth/forgot-password/reset
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("[FORGOT_PASSWORD] Reset password. email={}", request.getEmail());
        customerService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.ok("Đặt lại mật khẩu thành công"));
    }
}
