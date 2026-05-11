package com.ttn.sporttn.modules.payment.dto.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductFilterRequest {
    private int page;
    private int size;
    private String sort;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    private String categorySlug;
    private String subCategory;
    private List<String> brands;
}