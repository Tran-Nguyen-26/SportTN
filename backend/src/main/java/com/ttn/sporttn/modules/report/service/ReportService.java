package com.ttn.sporttn.modules.report.service;

import com.ttn.sporttn.modules.order.repository.OrderRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRMapCollectionDataSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public byte[] exportRevenuePdf(LocalDate from, LocalDate to) throws Exception {

        StoredProcedureQuery summaryQuery = entityManager
                .createStoredProcedureQuery("rpt_revenue_summary")
                .registerStoredProcedureParameter(1, LocalDate.class, ParameterMode.IN)
                .registerStoredProcedureParameter(2, LocalDate.class, ParameterMode.IN)
                .setParameter(1, from)
                .setParameter(2, to);

        summaryQuery.execute();
        Object[] summary = (Object[]) summaryQuery.getSingleResult();

        BigDecimal totalRevenue    = toBigDecimal(summary[0]);
        Long       totalOrders     = toLong(summary[1]);
        Long       doneOrders      = toLong(summary[2]);
        Long       cancelledOrders = toLong(summary[3]);
        BigDecimal avgOrderValue   = toBigDecimal(summary[4]);
        BigDecimal codRevenue      = toBigDecimal(summary[5]);
        BigDecimal vnpayRevenue    = toBigDecimal(summary[6]);

        BigDecimal totalPayment = codRevenue.add(vnpayRevenue);
        String codPercent = totalPayment.compareTo(BigDecimal.ZERO) > 0
                ? String.valueOf(codRevenue.multiply(BigDecimal.valueOf(100))
                                 .divide(totalPayment, 0, RoundingMode.HALF_UP))
                : "0";
        String vnpayPercent = totalPayment.compareTo(BigDecimal.ZERO) > 0
                ? String.valueOf(vnpayRevenue.multiply(BigDecimal.valueOf(100))
                                 .divide(totalPayment, 0, RoundingMode.HALF_UP))
                : "0";

        Map<String, Object> params = new HashMap<>();
        params.put("FROM_DATE",        from.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        params.put("TO_DATE",          to.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        params.put("TOTAL_REVENUE",    formatPrice(totalRevenue));
        params.put("TOTAL_ORDERS",     totalOrders);
        params.put("DONE_ORDERS",      doneOrders);
        params.put("CANCELLED_ORDERS", cancelledOrders);
        params.put("AVG_ORDER_VALUE",  formatPrice(avgOrderValue));
        params.put("COD_REVENUE",      formatPrice(codRevenue));
        params.put("COD_PERCENT",      codPercent);
        params.put("VNPAY_REVENUE",    formatPrice(vnpayRevenue));
        params.put("VNPAY_PERCENT",    vnpayPercent);

        StoredProcedureQuery chartQuery = entityManager
                .createStoredProcedureQuery("rpt_revenue_by_day")
                .registerStoredProcedureParameter(1, LocalDate.class, ParameterMode.IN)
                .registerStoredProcedureParameter(2, LocalDate.class, ParameterMode.IN)
                .setParameter(1, from)
                .setParameter(2, to);

        chartQuery.execute();
        List<Object[]> chartRows = chartQuery.getResultList();

        List<Map<String, ?>> rows = chartRows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("day",     String.valueOf(row[0]));
            map.put("revenue", formatPrice(toBigDecimal(row[1])));
            map.put("orders",  toLong(row[2]));
            return (Map<String, ?>) map;
        }).collect(Collectors.toList());

        JRMapCollectionDataSource dataSource = new JRMapCollectionDataSource(rows);

        StoredProcedureQuery topProductsQuery = entityManager
                .createStoredProcedureQuery("rpt_top_products")
                .registerStoredProcedureParameter(1, LocalDate.class, ParameterMode.IN)
                .registerStoredProcedureParameter(2, LocalDate.class, ParameterMode.IN)
                .registerStoredProcedureParameter(3, Integer.class,   ParameterMode.IN)
                .setParameter(1, from)
                .setParameter(2, to)
                .setParameter(3, 5);

        topProductsQuery.execute();
        List<Object[]> topProductRows = topProductsQuery.getResultList();

        List<Map<String, ?>> topProducts = topProductRows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("productName",  String.valueOf(row[0]));
            map.put("category",     String.valueOf(row[1]));
            map.put("totalSold",    toLong(row[2]));
            map.put("totalRevenue", formatPrice(toBigDecimal(row[3])));
            return (Map<String, ?>) map;
        }).collect(Collectors.toList());

        params.put("TOP_PRODUCTS", topProducts);

        InputStream template = getClass()
                .getResourceAsStream("/reports/revenue_report.jrxml");

        if (template == null) {
            throw new RuntimeException("Không tìm thấy template báo cáo");
        }

        JasperReport jasperReport = JasperCompileManager.compileReport(template);
        JasperPrint  jasperPrint  = JasperFillManager.fillReport(jasperReport, params, dataSource);

        log.info("[REPORT] Xuất báo cáo doanh thu. from={}, to={}", from, to);
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return BigDecimal.valueOf(((Number) value).doubleValue());
        return new BigDecimal(value.toString());
    }

    private Long toLong(Object value) {
        if (value == null) return 0L;
        if (value instanceof Number) return ((Number) value).longValue();
        return Long.parseLong(value.toString());
    }

    private String formatPrice(BigDecimal price) {
        if (price == null) return "0đ";
        return String.format("%,.0f", price).replace(",", ".") + "đ";
    }
}
