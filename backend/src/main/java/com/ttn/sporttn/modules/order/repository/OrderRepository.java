package com.ttn.sporttn.modules.order.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.ttn.sporttn.modules.overview.dto.response.RevenueChartResponse;
import com.ttn.sporttn.modules.overview.dto.response.TopProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ttn.sporttn.modules.order.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    Optional<Order> findByOrderCode(String orderCode);

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status, Pageable pageable);

    Page<Order> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' ORDER BY o.createdAt DESC")
    List<Order> findPendingOrders();

    Page<Order> findByPaymentStatusOrderByCreatedAtDesc(String paymentStatus, Pageable pageable);

    long countByUserId(Long userId);

    long countByStatus(String status);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);


    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o WHERE o.status = 'DELIVERED' AND o.createdAt BETWEEN :from AND :to")
    BigDecimal sumRevenueByPeriod(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("""
    SELECT new com.ttn.sporttn.modules.overview.dto.response.RevenueChartResponse(
        FUNCTION('FORMAT', o.createdAt, 'dd/MM'),
        COALESCE(SUM(o.finalAmount), 0),
        COUNT(o)
    )
    FROM Order o
    WHERE o.status = 'DELIVERED'
      AND o.createdAt BETWEEN :from AND :to
    GROUP BY FUNCTION('FORMAT', o.createdAt, 'dd/MM')
    ORDER BY MIN(o.createdAt)
    """)
    List<RevenueChartResponse> getRevenueChart(@Param("from") LocalDateTime from,
                                               @Param("to")   LocalDateTime to);

    @Query("""
    SELECT new com.ttn.sporttn.modules.overview.dto.response.TopProductResponse(
        p.name,
        c.name,
        SUM(oi.quantity),
        SUM(oi.priceAtPurchase * oi.quantity)
    )
    FROM OrderItem oi
    JOIN oi.productVariant pv
    JOIN pv.product p
    JOIN p.category c
    JOIN oi.order o
    WHERE o.status = 'DELIVERED'
      AND o.createdAt BETWEEN :from AND :to
    GROUP BY p.id, p.name, c.name
    ORDER BY SUM(oi.quantity) DESC
    """)
    List<TopProductResponse> getTopProducts(@Param("from") LocalDateTime from,
                                            @Param("to")   LocalDateTime to,
                                            Pageable pageable);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();
}
