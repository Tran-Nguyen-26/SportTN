package com.ttn.sporttn.modules.product.dto.request.admin;

import lombok.Getter;

import java.util.List;

@Getter
public class ProductUpdateRequest {
    private String name;
    private String slug;
    private String description;
    private Long categoryId;
    private Long brandId;
    private Boolean active;
    private String mainImageUrl;
    private List<String> extraImageUrls;
    private List<VariantUpdateRequest> variants;
}
