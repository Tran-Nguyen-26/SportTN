package com.ttn.sporttn.modules.product.dto.response.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class VariantDetailResponse {
    private Long id;
    private String sku;
    private String color;
    private String size;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Integer weightGram;
    private boolean active;
    private String mainImageUrl;

    // Ảnh riêng của từng variant (nếu có)
    private List<String> imageUrls;
}
