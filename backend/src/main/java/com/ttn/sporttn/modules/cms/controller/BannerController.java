package com.ttn.sporttn.modules.cms.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.cms.dto.request.BannerCreateRequest;
import com.ttn.sporttn.modules.cms.dto.response.BannerResponse;
import com.ttn.sporttn.modules.cms.entity.Banner;
import com.ttn.sporttn.modules.cms.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/{position}")
    public ResponseEntity<ApiResponse<List<Banner>>> getBannerByPosition(@PathVariable String position) {
        return ResponseEntity.ok(ApiResponse.ok(bannerService.getBannerByPos(position)));
    }

}
