package com.ttn.sporttn.modules.product.service;

import com.ttn.sporttn.modules.product.dto.request.admin.BrandAddRequest;
import com.ttn.sporttn.modules.product.dto.request.admin.BrandUpdateRequest;
import com.ttn.sporttn.modules.product.dto.response.admin.BrandResponse;
import com.ttn.sporttn.modules.product.entity.Brand;
import com.ttn.sporttn.modules.product.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    @Cacheable(value = "brands")
    public List<BrandResponse> getBrands() {
        log.info("Lấy danh sách brands");
        return brandRepository.findAllBrandResponses();
    }

    @CacheEvict(value = "brands", allEntries = true)
    @Transactional
    public BrandResponse addBrand(BrandAddRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên thương hiệu đã tồn tại!");
        }

        if (brandRepository.existsBySlug(request.getSlug())) {
            throw new RuntimeException("Slug đã tồn tại");
        }

        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setColor(request.getColor());
        brand.setActive(true);
        brand.setProducts(new ArrayList<>());

        String slug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? request.getSlug()
                : generateSlug(request.getName());
        brand.setSlug(slug);

        Brand savedBrand = brandRepository.save(brand);

        return toBrandResponse(savedBrand);
    }

    @CacheEvict(value = "brands", allEntries = true)
    @Transactional
    public BrandResponse updateBrand(Long brandId, BrandUpdateRequest request) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thương hiệu với ID: " + brandId));

        if (request.getName() != null) {
            if (brandRepository.existsByNameAndIdNot(request.getName(), brandId)) {
                throw new RuntimeException("Tên thương hiệu đã tồn tại!");
            }
            brand.setName(request.getName());
        }

        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            if (brandRepository.existsBySlugAndIdNot(request.getSlug(), brandId)) {
                throw new RuntimeException("Slug đã tồn tại!");
            }
            brand.setSlug(request.getSlug());
        }

        brand.setName(request.getName());
        brand.setColor(request.getColor());
        brand.setDescription(request.getDescription());
        brand.setWebsiteUrl(request.getWebsiteUrl());
        brand.setActive(request.isActive());

        if (request.getLogoUrl() != null && !request.getLogoUrl().isBlank()) {
            brand.setLogoUrl(request.getLogoUrl());
        }

        Brand updatedBrand = brandRepository.save(brand);

        return toBrandResponse(updatedBrand);
    }

    private String generateSlug(String input) {
        if (input == null || input.isBlank()) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("")
                .toLowerCase(Locale.ENGLISH)
                .replaceAll("đ", "d")
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("^-+|-+$", "");
        return slug;
    }

    private BrandResponse toBrandResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .color(brand.getColor())
                .logoUrl(brand.getLogoUrl())
                .websiteUrl(brand.getWebsiteUrl())
                .description(brand.getDescription())
                .active(brand.getActive())
                .totalProducts(brand.getProducts() != null ? (long) brand.getProducts().size() : 0L)
                .build();
    }
}
