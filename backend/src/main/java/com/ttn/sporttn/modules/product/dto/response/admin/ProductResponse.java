package com.ttn.sporttn.modules.product.dto.response.admin;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String mainImageUrl;

    // Category
    private Long categoryId;
    private String categoryName;

    // Brand
    private Long brandId;
    private String brandName;

    private Boolean active;

    // Thống kê nhanh (tính từ variants)
    private Integer totalStock;       // tổng tồn kho tất cả variants
    private BigDecimal minPrice;            // giá thấp nhất (salePrice ưu tiên, fallback originalPrice)
    private BigDecimal maxPrice;            // giá cao nhất
    private Integer variantCount;     // số lượng biến thể

    private List<ProductVariantResponse> variants;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


