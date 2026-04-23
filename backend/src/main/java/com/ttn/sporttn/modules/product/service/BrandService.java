package com.ttn.sporttn.modules.product.service;

import com.ttn.sporttn.modules.product.dto.request.admin.BrandAddRequest;
import com.ttn.sporttn.modules.product.dto.response.admin.BrandResponse;
import com.ttn.sporttn.modules.product.entity.Brand;
import com.ttn.sporttn.modules.product.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<BrandResponse> getBrands() {
        return brandRepository.findAll()
                .stream()
                .map(this::toBrandResponse)
                .toList();
    }

    @Transactional
    public BrandResponse addBrand(BrandAddRequest request) {
        // 1. Kiểm tra trùng tên hoặc trùng slug (Validation sớm)
        if (brandRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên thương hiệu đã tồn tại!");
        }

        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setActive(true);
        brand.setProducts(new ArrayList<>());

        // 3. Xử lý Slug tự động nếu Request không gửi lên
        String slug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? request.getSlug()
                : generateSlug(request.getName());
        brand.setSlug(slug);

        Brand savedBrand = brandRepository.save(brand);

        return toBrandResponse(savedBrand);
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
                .logoUrl(brand.getLogoUrl())
                .websiteUrl(brand.getWebsiteUrl())
                .description(brand.getDescription())
                .active(brand.getActive())
                .totalProducts(brand.getProducts() != null ? (long) brand.getProducts().size() : 0L)
                .build();
    }
}
