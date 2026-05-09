package com.ttn.sporttn.modules.overview.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private BigDecimal revenue;
    private long       newOrders;
    private long       newCustomers;
    private long       totalProducts;
    private double     revenueTrend;
    private double     orderTrend;
    private double     customerTrend;
}
