package com.ttn.sporttn.modules.cms.service;

import com.ttn.sporttn.modules.cms.dto.request.BannerCreateRequest;
import com.ttn.sporttn.modules.cms.dto.response.BannerResponse;
import com.ttn.sporttn.modules.cms.entity.Banner;
import com.ttn.sporttn.modules.cms.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<Banner> getBannerByPos(String pos) {
        return bannerRepository.findByPositionAndActiveTrueOrderByDisplayOrderAsc(pos);
    }

    public BannerResponse createBanner(BannerCreateRequest request) {
        Banner banner = Banner.builder()
                .title(request.getTitle())
                .imageUrl(request.getImageUrl())
                .linkUrl(request.getLinkUrl())
                .position(request.getPosition())
                .displayOrder(request.getDisplayOrder())
                .active(request.getActive() != null ? request.getActive() : true) // Mặc định active = true nếu không truyền
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        Banner savedBanner = bannerRepository.save(banner);

        return BannerResponse.builder()
                .id(savedBanner.getId())
                .title(savedBanner.getTitle())
                .imageUrl(savedBanner.getImageUrl())
                .linkUrl(savedBanner.getLinkUrl())
                .position(savedBanner.getPosition())
                .displayOrder(savedBanner.getDisplayOrder())
                .active(savedBanner.getActive())
                .startDate(savedBanner.getStartDate())
                .endDate(savedBanner.getEndDate())
                .build();
    }

    public List<BannerResponse> getAllBanners() {
        List<Banner> banners = bannerRepository.findAll();

        return banners.stream()
                .map(banner -> BannerResponse.builder()
                        .id(banner.getId())
                        .title(banner.getTitle())
                        .imageUrl(banner.getImageUrl())
                        .linkUrl(banner.getLinkUrl())
                        .position(banner.getPosition())
                        .displayOrder(banner.getDisplayOrder())
                        .active(banner.getActive())
                        .startDate(banner.getStartDate())
                        .endDate(banner.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }
}
