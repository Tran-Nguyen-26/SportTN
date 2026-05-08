package com.ttn.sporttn.modules.product.dto.response.admin;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ProductVariantResponse {
    private Long id;
    private String sku;
    private String color;
    private String size;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;           // null nếu không có giá sale
    private Integer stockQuantity;
    private Integer weightGram;       // null nếu không khai báo
    private String mainImageUrl;
    private List<VariantImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



