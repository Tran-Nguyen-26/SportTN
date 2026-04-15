package com.ttn.sporttn.modules.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class InventoryLogResponse {
    private Long id;
    private String variantSku;
    private Integer changeQuantity;
    private String actionType;
    private String reason;
    private String createdBy;
    private LocalDateTime createdAt;
}
