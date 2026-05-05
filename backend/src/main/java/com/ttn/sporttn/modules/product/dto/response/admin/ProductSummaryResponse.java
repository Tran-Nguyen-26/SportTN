package com.ttn.sporttn.modules.product.dto.response.admin;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response gọn — dùng cho trang danh sách sản phẩm (table/grid).
 * Không kèm variants để giảm payload.
 * Dùng ProductResponse (full) cho trang chi tiết / edit.
 */
@Getter
@Builder
public class ProductSummaryResponse {
    private Long id;
    private String name;
    private String slug;
    private String mainImageUrl;

    private Long categoryId;
    private String categoryName;

    private Long brandId;
    private String brandName;

    private Boolean active;
    private Integer totalStock;
    private BigDecimal minPrice;
    private Integer variantCount;
    private Integer soldCount;        // tổng đã bán (nếu có)

    private LocalDateTime createdAt;
}

