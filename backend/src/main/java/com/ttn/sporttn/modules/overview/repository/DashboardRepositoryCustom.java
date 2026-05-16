package com.ttn.sporttn.modules.overview.repository;

import com.ttn.sporttn.modules.overview.dto.response.DashboardStatsResponse;
import com.ttn.sporttn.modules.overview.dto.response.RevenueChartResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface DashboardRepositoryCustom {
    DashboardStatsResponse getStatsViaStore(LocalDateTime fromDate, LocalDateTime toDate);

    List<RevenueChartResponse> getRevenueChart(LocalDate fromDate, LocalDate toDate);
}
