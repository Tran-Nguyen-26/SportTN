package com.ttn.sporttn.modules.cms.service;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.category.entity.Category;
import com.ttn.sporttn.modules.category.repository.CategoryRepository;
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
    private final CategoryRepository categoryRepository;

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
                .active(request.getActive() != null ? request.getActive() : true)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
            banner.setCategory(category);
        }

        Banner savedBanner = bannerRepository.save(banner);

        return BannerResponse.builder()
                .id(savedBanner.getId())
                .title(savedBanner.getTitle())
                .imageUrl(savedBanner.getImageUrl())
                .linkUrl(savedBanner.getLinkUrl())
                .position(savedBanner.getPosition())
                .displayOrder(savedBanner.getDisplayOrder())
                .active(savedBanner.getActive())
                .categoryId(savedBanner.getCategory() != null ? savedBanner.getCategory().getId() : null)
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
                        .categoryId(banner.getCategory() != null ? banner.getCategory().getId() : null)
                        .startDate(banner.getStartDate())
                        .endDate(banner.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.BANNER_NOT_FOUND));

        bannerRepository.delete(banner);
    }

    public BannerResponse toggleBannerStatus(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.BANNER_NOT_FOUND));

        Boolean currentActive = banner.getActive();
        banner.setActive(currentActive == null || !currentActive);

        Banner savedBanner = bannerRepository.save(banner);

        return BannerResponse.builder()
                .id(savedBanner.getId())
                .title(savedBanner.getTitle())
                .imageUrl(savedBanner.getImageUrl())
                .linkUrl(savedBanner.getLinkUrl())
                .position(savedBanner.getPosition())
                .displayOrder(savedBanner.getDisplayOrder())
                .active(savedBanner.getActive())
                .categoryId(savedBanner.getCategory() != null ? savedBanner.getCategory().getId() : null)
                .startDate(savedBanner.getStartDate())
                .endDate(savedBanner.getEndDate())
                .build();
    }
}
