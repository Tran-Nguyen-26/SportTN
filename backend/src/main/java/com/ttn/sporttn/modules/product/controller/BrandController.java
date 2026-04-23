package com.ttn.sporttn.modules.product.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.product.dto.request.admin.BrandAddRequest;
import com.ttn.sporttn.modules.product.dto.response.admin.BrandResponse;
import com.ttn.sporttn.modules.product.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getBrands() {
        List<BrandResponse> brands = brandService.getBrands();
        return ResponseEntity.ok(ApiResponse.ok(brands));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BrandResponse>> addBrands(@Valid @RequestBody BrandAddRequest request) {
        BrandResponse brand = brandService.addBrand(request);
        return ResponseEntity.ok(ApiResponse.ok(brand, "Thêm thương hiệu thành công"));
    }

}
