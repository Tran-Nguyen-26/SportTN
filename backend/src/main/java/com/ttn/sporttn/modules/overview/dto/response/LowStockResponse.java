package com.ttn.sporttn.modules.overview.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LowStockResponse {
    private String name;
    private String sku;
    private int    stock;
}
