package com.ttn.sporttn.modules.product.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String description;
    private String categoryName;
    private String brandName;
    private String mainImageUrl;
    
    private List<VariantResponse> variants;
    private List<ImageResponse> images;
}
