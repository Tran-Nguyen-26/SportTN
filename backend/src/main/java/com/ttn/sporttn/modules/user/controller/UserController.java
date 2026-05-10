package com.ttn.sporttn.modules.user.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.user.dto.request.ChangePasswordRequest;
import com.ttn.sporttn.modules.user.service.UserService;
import com.ttn.sporttn.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Đổi mật khẩu thành công"));
    }

    @PatchMapping("/phone")
    public ResponseEntity<ApiResponse<?>> updatePhone(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> request) {
        userService.updatePhone(userDetails.getId(), request.get("phone"));
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật số điện thoại thành công"));
    }

}
