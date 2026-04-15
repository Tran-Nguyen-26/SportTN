package com.ttn.sporttn.modules.product.dto.request;

import java.util.List;

import lombok.Getter;

@Getter
public class ProductRequest {
    private String name;
    private String description;
    private Long categoryId;
    private Long brandId;

    private List<VariantRequest> variants;
    private List<ImageRequest> images;
}
