package com.ttn.sporttn.modules.overview.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.overview.dto.response.*;
import com.ttn.sporttn.modules.overview.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ApiResponse<DashboardStatsResponse> getStats(
            @RequestParam(defaultValue = "today") String period) {
        log.info("[DASHBOARD] Lấy thống kê. period={}", period);
        return ApiResponse.ok(
                dashboardService.getStats(period),
                "Lấy thống kê thành công"
        );
    }

    @GetMapping("/revenue-chart")
    public ApiResponse<List<RevenueChartResponse>> getRevenueChart(
            @RequestParam(defaultValue = "today") String period) {
        log.info("[DASHBOARD] Lấy biểu đồ doanh thu. period={}", period);
        return ApiResponse.ok(
                dashboardService.getRevenueChart(period),
                "Lấy biểu đồ thành công"
        );
    }

    @GetMapping("/top-products")
    public ApiResponse<List<TopProductResponse>> getTopProducts(
            @RequestParam(defaultValue = "week") String period) {
        log.info("[DASHBOARD] Lấy sản phẩm bán chạy. period={}", period);
        return ApiResponse.ok(
                dashboardService.getTopProducts(period),
                "Lấy sản phẩm bán chạy thành công"
        );
    }

    @GetMapping("/low-stock")
    public ApiResponse<List<LowStockResponse>> getLowStock(
            @RequestParam(defaultValue = "10") int threshold) {
        log.info("[DASHBOARD] Lấy sản phẩm sắp hết hàng. threshold={}", threshold);
        return ApiResponse.ok(
                dashboardService.getLowStock(threshold),
                "Lấy sản phẩm sắp hết hàng thành công"
        );
    }

    @GetMapping("/order-status-summary")
    public ApiResponse<List<Map<String, Object>>> getOrderStatusSummary() {
        return ApiResponse.ok(dashboardService.getOrderStatusSummary());
    }

    @GetMapping("/recent-orders")
    public ApiResponse<List<RecentOrderResponse>> getRecentOrders(
            @RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.ok(dashboardService.getRecentOrders(limit));
    }
}
