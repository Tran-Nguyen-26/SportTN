package com.ttn.sporttn.modules.overview.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopProductResponse {
    private String name;
    private String category;
    private Long sold;
    private BigDecimal revenue;
}
