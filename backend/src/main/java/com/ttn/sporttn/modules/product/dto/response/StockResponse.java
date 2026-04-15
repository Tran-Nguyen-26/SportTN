package com.ttn.sporttn.modules.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class StockResponse {
    private Long variantId;
    private String sku;
    private Integer currentStock;
    private boolean isLowStock;
    private Integer lowStockThreshold;
}
