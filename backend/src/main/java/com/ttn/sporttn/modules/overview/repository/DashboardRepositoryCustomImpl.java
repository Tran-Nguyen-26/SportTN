package com.ttn.sporttn.modules.overview.repository;

import com.ttn.sporttn.modules.overview.dto.response.DashboardStatsResponse;
import com.ttn.sporttn.modules.overview.dto.response.RevenueChartResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.Query;
import jakarta.persistence.StoredProcedureQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class DashboardRepositoryCustomImpl implements DashboardRepositoryCustom {

    private final EntityManager em;

    @Override
    public DashboardStatsResponse getStatsViaStore(LocalDateTime fromDate, LocalDateTime toDate) {
        StoredProcedureQuery query = em
                .createStoredProcedureQuery("sp_get_dashboard_stats")
                .registerStoredProcedureParameter("FromDate", LocalDate.class, ParameterMode.IN)
                .registerStoredProcedureParameter("ToDate", LocalDate.class, ParameterMode.IN)
                .setParameter("FromDate", fromDate.toLocalDate())
                .setParameter("ToDate", toDate.toLocalDate());

        Object[] row = (Object[]) query.getSingleResult();

        BigDecimal revenue = (BigDecimal) row[0];
        long newOrders = ((Number) row[1]).longValue();
        long newCustomers = ((Number) row[2]).longValue();
        long totalProducts = ((Number) row[3]).longValue();

        return DashboardStatsResponse.builder()
                .revenue(revenue)
                .newOrders(newOrders)
                .newCustomers(newCustomers)
                .totalProducts(totalProducts)
                .revenueTrend(0.0)
                .orderTrend(0.0)
                .customerTrend(0.0)
                .build();
    }

    @Override
    public List<RevenueChartResponse> getRevenueChart(LocalDate fromDate, LocalDate toDate) {

        String sql = """
            SELECT FORMAT(issue_date, 'dd/MM') as day, COALESCE(SUM(final_amount), 0) as revenue, COUNT(*)
            FROM invoices i
            WHERE i.status = 'PAID'
                AND i.issue_date BETWEEN ?1 AND ?2
            GROUP BY FORMAT(issue_date, 'dd/MM')
            ORDER BY MIN(issue_date)
        """;

        Query query = em.createNativeQuery(sql);
        query.setParameter(1, fromDate);
        query.setParameter(2, toDate);

        List<Object[]> rows = query.getResultList();

        return rows.stream()
                .map(row -> RevenueChartResponse.builder()
                        .day((String) row[0])
                        .revenue((BigDecimal) row[1])
                        .orders(((Number) row[2]).longValue())
                        .build())
                .toList();
    }
}
