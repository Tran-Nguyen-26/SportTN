package com.ttn.sporttn.modules.product.dto.request.admin;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
public class VariantUpdateRequest {
    private Long id;
    private String sku;
    private String color;
    private String size;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Integer weightGram;
    private List<String> imageUrls;
}
