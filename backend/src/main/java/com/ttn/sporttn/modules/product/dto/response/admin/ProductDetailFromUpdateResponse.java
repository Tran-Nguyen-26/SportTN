package com.ttn.sporttn.modules.product.dto.response.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

//trang chỉnh sửa product

@Getter
@Setter
@Builder
public class ProductDetailFromUpdateResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String mainImageUrl;
    private boolean active;

    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;

    private List<String> extraImageUrls;

    private List<VariantDetailResponse> variants;
}
