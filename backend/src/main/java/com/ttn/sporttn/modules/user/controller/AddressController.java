package com.ttn.sporttn.modules.user.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.user.dto.request.AddressRequest;
import com.ttn.sporttn.modules.user.dto.response.AddressResponse;
import com.ttn.sporttn.modules.user.service.AddressService;
import com.ttn.sporttn.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // GET /api/v1/users/addresses -> getMyAddresses()
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getMyAddresses(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var addresses = addressService.getMyAddresses(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(addresses));
    }

    // POST /api/v1/users/addresses -> createAddress()
    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> createAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AddressRequest request) {
        var address = addressService.createAddress(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(address));
    }

    // PUT /api/v1/users/addresses/{id} -> updateAddress()
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        var address = addressService.updateAddress(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok(address));
    }

    // DELETE /api/v1/users/addresses/{id} -> deleteAddress()
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        addressService.deleteAddress(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // PATCH /api/v1/users/addresses/{id}/default -> setDefault()
    @PatchMapping("/{id}/default")
    public ResponseEntity<ApiResponse<AddressResponse>> setDefault(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        var address = addressService.setDefault(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(address));
    }
}