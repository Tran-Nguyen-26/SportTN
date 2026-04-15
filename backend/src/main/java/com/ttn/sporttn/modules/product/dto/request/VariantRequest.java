package com.ttn.sporttn.modules.product.dto.request;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class VariantRequest {
    private String sku;
    private String color;
    private String size;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Integer weightGram;
}
