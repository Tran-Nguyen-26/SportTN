package com.ttn.sporttn.modules.overview.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueChartResponse {
    private String     day;
    private BigDecimal revenue;
    private Long       orders;
}
