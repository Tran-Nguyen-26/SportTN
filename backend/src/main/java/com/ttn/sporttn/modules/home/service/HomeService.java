package com.ttn.sporttn.modules.home.service;

import com.ttn.sporttn.modules.category.dto.response.CategoryResponse;
import com.ttn.sporttn.modules.category.entity.Category;
import com.ttn.sporttn.modules.category.repository.CategoryRepository;
import com.ttn.sporttn.modules.cms.dto.response.BannerResponse;
import com.ttn.sporttn.modules.cms.entity.Banner;
import com.ttn.sporttn.modules.cms.repository.BannerRepository;
import com.ttn.sporttn.modules.home.response.CategorySectionResponse;
import com.ttn.sporttn.modules.home.response.HomeResponse;
import com.ttn.sporttn.modules.product.dto.response.ProductCardResponse;
import com.ttn.sporttn.modules.product.mapper.ProductMapper;
import com.ttn.sporttn.modules.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BannerRepository bannerRepository;
    private final ProductMapper productMapper;

    private static final Pageable TOP_10 = PageRequest.of(0, 10);

    public HomeResponse getHomeData() {
        return HomeResponse.builder()
                .heroBanners(getHeroBanners())
                .mostSearched(getMostSearched())
                .categories(getCategories())
                .bestSellers(getBestSellers())
                .cheapQuality(getCheapQuality())
                .categorySections(getCategorySections())
                .build();
    }

    private List<BannerResponse> getHeroBanners() {
        return bannerRepository
                .findByPositionAndActiveTrueOrderByDisplayOrderAsc("HERO")
                .stream()
                .map(this::toBannerResponse)
                .collect(Collectors.toList());
    }

    private List<CategoryResponse> getCategories() {
        return categoryRepository
                .findByParentIsNullAndActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
    }

    private List<CategoryResponse> getSportsPopular() {
        return categoryRepository
                .findTop10ByParentSlugAndActiveTrueOrderByDisplayOrderAsc("sport")
                .stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
    }

    private List<ProductCardResponse> getMostSearched() {
        return productRepository
                .findTop10ByActiveTrueOrderBySearchCountDesc()
                .stream()
                .map(productMapper::toProductCartResponse)
                .collect(Collectors.toList());
    }

    private List<ProductCardResponse> getBestSellers() {
        return productRepository.findTop10ByActiveTrueOrderBySoldCountDesc()
                .stream()
                .map(productMapper::toProductCartResponse)
                .collect(Collectors.toList());
    }

    private List<ProductCardResponse> getCheapQuality() {
        return productRepository.findTop10Cheapest(TOP_10)
                .stream()
                .map(productMapper::toProductCartResponse)
                .collect(Collectors.toList());
    }

    private List<CategorySectionResponse> getCategorySections() {
        return categoryRepository.findByParentIsNullAndShowOnHomeTrueAndActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toCategorySection)
                .collect(Collectors.toList());
    }

    private CategorySectionResponse toCategorySection(Category category) {
        //banner của section
        List<BannerResponse> banners = bannerRepository
                .findByPositionAndCategoryIdAndActiveTrueOrderByDisplayOrderAsc(
                        "CATEGORY",
                        category.getId()
                )
                .stream()
                .map(this::toBannerResponse)
                .collect(Collectors.toList());

        List<CategoryResponse> subCategories = categoryRepository
                .findByParentIdAndActiveTrueOrderByDisplayOrderAsc(category.getId())
                .stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());

        List<ProductCardResponse> products = productRepository
                .findTop10ByCategoryIdAndActiveTrueOrderBySoldCountDesc(category.getId(), TOP_10)
                .stream()
                .map(productMapper::toProductCartResponse)
                .collect(Collectors.toList());

        return CategorySectionResponse.builder()
                .categoryId(category.getId())
                .title(category.getSectionTitle())
                .categorySlug(category.getSlug())
                .banners(banners)
                .subCategories(subCategories)
                .products(products)
                .build();
    }

    private BannerResponse toBannerResponse(Banner banner) {
        return BannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .imageUrl(banner.getImageUrl())
                .linkUrl(banner.getLinkUrl())
                .displayOrder(banner.getDisplayOrder())
                .build();
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .imageUrl(category.getImageUrl())
                .linkUrl(category.getLinkUrl())
                .build();
    }
}
