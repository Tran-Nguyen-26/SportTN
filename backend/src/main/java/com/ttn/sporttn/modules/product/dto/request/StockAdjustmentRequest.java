package com.ttn.sporttn.modules.product.dto.request;

import lombok.Getter;

@Getter
public class StockAdjustmentRequest {
    private Long variantId;
    private Integer quantity;
    private String actionType;  // IMPORT, EXPORT_ORDER, RETURN, ADJUSTMENT
    private String reason;
}
