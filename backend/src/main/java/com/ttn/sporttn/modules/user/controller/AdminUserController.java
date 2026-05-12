package com.ttn.sporttn.modules.user.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.user.dto.request.admin.AdminUserCreateRequest;
import com.ttn.sporttn.modules.user.dto.request.admin.AdminUserUpdateRequest;
import com.ttn.sporttn.modules.user.dto.request.admin.ToggleActiveRequest;
import com.ttn.sporttn.modules.user.dto.response.admin.AdminUserResponse;
import com.ttn.sporttn.modules.user.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAll() {
        log.info("[ADMIN_USER] Lấy danh sách admin users");
        return ResponseEntity.ok(ApiResponse.ok(adminUserService.getAllAdminUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> getById(@PathVariable Long id) {
        log.info("[ADMIN_USER] Lấy chi tiết admin user. id={}", id);
        return ResponseEntity.ok(ApiResponse.ok(adminUserService.getAdminUserById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminUserResponse>> create(
            @Valid @RequestBody AdminUserCreateRequest request
    ) {
        log.info("[ADMIN_USER] Tạo admin user mới. email={}", request.getEmail());
        return ResponseEntity.ok(ApiResponse.ok(adminUserService.createAdminUser(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserUpdateRequest request
    ) {
        log.info("[ADMIN_USER] Cập nhật admin user. id={}", id);
        return ResponseEntity.ok(ApiResponse.ok(adminUserService.updateAdminUser(id, request)));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<ApiResponse<AdminUserResponse>> toggleActive(
            @PathVariable Long id,
            @RequestBody ToggleActiveRequest request
    ) {
        log.info("[ADMIN_USER] Toggle active. id={}, active={}", id, request.getActive());
        return ResponseEntity.ok(ApiResponse.ok(adminUserService.toggleActive(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        log.info("[ADMIN_USER] Xóa admin user. id={}", id);
        adminUserService.deleteAdminUser(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}

