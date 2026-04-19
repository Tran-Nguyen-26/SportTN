package com.ttn.sporttn.modules.product.dto.response;

import com.ttn.sporttn.modules.product.entity.Product;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class ProductCardResponse {
    private Long id;
    private String name;
    private String mainImageUrl;
    private String brandName;
    private Double rating;
    private Integer reviewCount;
    private Integer soldCount;

    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private BigDecimal effectivePrice;
    private Integer discountPercent;
    private boolean isOnSale;

    private Boolean isNew;
    private Boolean isBestSeller;
}
