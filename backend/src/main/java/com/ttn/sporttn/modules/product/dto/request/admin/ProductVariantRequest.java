package com.ttn.sporttn.modules.product.dto.request.admin;

import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
public class ProductVariantRequest {
    private String sku;
    private String color;
    private String size;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;           // nullable
    private Integer stockQuantity;
    private Integer weightGram;       // nullable
    private String mainImageUrl;
    private List<VariantImageRequest> images;
}


