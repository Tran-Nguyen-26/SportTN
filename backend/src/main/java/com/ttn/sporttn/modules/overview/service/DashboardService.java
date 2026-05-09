package com.ttn.sporttn.modules.overview.service;

import com.ttn.sporttn.modules.order.repository.OrderRepository;
import com.ttn.sporttn.modules.overview.dto.response.*;
import com.ttn.sporttn.modules.product.repository.ProductVariantRepository;
import com.ttn.sporttn.modules.user.entity.UserRole;
import com.ttn.sporttn.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    // ── STATS ─────────────────────────────────────────────────────────────────

    public DashboardStatsResponse getStats(String period) {
        LocalDateTime[] current  = getRange(period);
        LocalDateTime[] previous = getPreviousRange(period);

        BigDecimal currentRevenue  = getRevenue(current[0],  current[1]);
        BigDecimal previousRevenue = getRevenue(previous[0], previous[1]);

        long currentOrders   = orderRepository.countByCreatedAtBetween(current[0],  current[1]);
        long previousOrders  = orderRepository.countByCreatedAtBetween(previous[0], previous[1]);

        long currentCustomers  = userRepository.countByRoleAndCreatedAtBetween(UserRole.CUSTOMER, current[0],  current[1]);
        long previousCustomers = userRepository.countByRoleAndCreatedAtBetween(UserRole.CUSTOMER, previous[0], previous[1]);

        long totalProducts = productVariantRepository.countByStockQuantityGreaterThan(0);

        return DashboardStatsResponse.builder()
                .revenue(currentRevenue)
                .newOrders(currentOrders)
                .newCustomers(currentCustomers)
                .totalProducts(totalProducts)
                .revenueTrend(calcTrend(previousRevenue.doubleValue(), currentRevenue.doubleValue()))
                .orderTrend(calcTrend(previousOrders, currentOrders))
                .customerTrend(calcTrend(previousCustomers, currentCustomers))
                .build();
    }

    // ── REVENUE CHART ─────────────────────────────────────────────────────────

    public List<RevenueChartResponse> getRevenueChart(String period) {
        LocalDateTime from = getRange(period)[0];
        LocalDateTime to   = getRange(period)[1];

        return orderRepository.getRevenueChart(from, to);
    }

    // ── TOP PRODUCTS ──────────────────────────────────────────────────────────

    public List<TopProductResponse> getTopProducts(String period) {
        LocalDateTime from = getRange(period)[0];
        LocalDateTime to   = getRange(period)[1];

        return orderRepository.getTopProducts(from, to, PageRequest.of(0, 5));
    }

    // ── LOW STOCK ─────────────────────────────────────────────────────────────

    public List<LowStockResponse> getLowStock(int threshold) {
        return productVariantRepository
                .findLowStock(threshold)
                .stream()
                .map(v -> LowStockResponse.builder()
                        .name(v.getProduct().getName()
                                + " - " + v.getColor()
                                + " / "  + v.getSize())
                        .sku(v.getSku())
                        .stock(v.getStockQuantity())
                        .build())
                .toList();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private BigDecimal getRevenue(LocalDateTime from, LocalDateTime to) {
        BigDecimal revenue = orderRepository.sumRevenueByPeriod(from, to);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    private double calcTrend(double previous, double current) {
        if (previous == 0) return 100.0;
        return Math.round(((current - previous) / previous) * 1000.0) / 10.0;
    }

    private LocalDateTime[] getRange(String period) {
        LocalDateTime now = LocalDateTime.now();
        return switch (period) {
            case "today" -> new LocalDateTime[]{ now.toLocalDate().atStartOfDay(), now };
            case "week"  -> new LocalDateTime[]{ now.minusDays(7), now };
            case "month" -> new LocalDateTime[]{ now.minusDays(30), now };
            default      -> new LocalDateTime[]{ now.toLocalDate().atStartOfDay(), now };
        };
    }

    private LocalDateTime[] getPreviousRange(String period) {
        LocalDateTime now = LocalDateTime.now();
        return switch (period) {
            case "today" -> new LocalDateTime[]{ now.minusDays(1).toLocalDate().atStartOfDay(), now.minusDays(1) };
            case "week"  -> new LocalDateTime[]{ now.minusDays(14), now.minusDays(7) };
            case "month" -> new LocalDateTime[]{ now.minusDays(60), now.minusDays(30) };
            default      -> new LocalDateTime[]{ now.minusDays(1).toLocalDate().atStartOfDay(), now.minusDays(1) };
        };
    }

    public List<Map<String, Object>> getOrderStatusSummary() {
        List<Object[]> results = orderRepository.countByStatus();
        return results.stream().map(r -> Map.of(
                "status", r[0],
                "count",  r[1]
        )).collect(Collectors.toList());
    }

    public List<RecentOrderResponse> getRecentOrders(int limit) {
        return orderRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(RecentOrderResponse::from)
                .collect(Collectors.toList());
    }
}
