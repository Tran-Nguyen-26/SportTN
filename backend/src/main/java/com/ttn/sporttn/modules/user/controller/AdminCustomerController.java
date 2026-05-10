package com.ttn.sporttn.modules.user.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.user.dto.request.admin.ToggleActiveRequest;
import com.ttn.sporttn.modules.user.dto.response.admin.AdminCustomerResponse;
import com.ttn.sporttn.modules.user.service.AdminCustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    // GET /api/v1/admin/customers
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminCustomerResponse>>> getAll() {
        log.info("[ADMIN_CUSTOMER] Lấy danh sách customers");
        return ResponseEntity.ok(ApiResponse.ok(adminCustomerService.getAllCustomers()));
    }

    // GET /api/v1/admin/customers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminCustomerResponse>> getById(@PathVariable Long id) {
        log.info("[ADMIN_CUSTOMER] Lấy chi tiết customer. id={}", id);
        return ResponseEntity.ok(ApiResponse.ok(adminCustomerService.getCustomerById(id)));
    }

    // PATCH /api/v1/admin/customers/{id}/active
    @PatchMapping("/{id}/active")
    public ResponseEntity<ApiResponse<AdminCustomerResponse>> toggleActive(
            @PathVariable Long id,
            @RequestBody ToggleActiveRequest request
    ) {
        log.info("[ADMIN_CUSTOMER] Toggle active. id={}, status={}", id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok(adminCustomerService.toggleActive(id, request)));
    }

    // DELETE /api/v1/admin/customers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        log.info("[ADMIN_CUSTOMER] Xóa customer. id={}", id);
        adminCustomerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}