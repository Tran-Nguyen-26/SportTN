package com.ttn.sporttn.modules.cms.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.cms.dto.request.BannerCreateRequest;
import com.ttn.sporttn.modules.cms.dto.response.BannerResponse;
import com.ttn.sporttn.modules.cms.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/banners")
@RequiredArgsConstructor
public class BannerAdminController {

    private final BannerService bannerService;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<BannerResponse>>> getAllBanners() {
        List<BannerResponse> responses = bannerService.getAllBanners();
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<BannerResponse>> createBanner(@RequestBody BannerCreateRequest request) {
        BannerResponse response = bannerService.createBanner(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Thêm banner thành công"));
    }
}
