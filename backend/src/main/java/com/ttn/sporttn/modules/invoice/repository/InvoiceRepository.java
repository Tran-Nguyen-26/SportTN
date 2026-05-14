package com.ttn.sporttn.modules.invoice.repository;

import com.ttn.sporttn.modules.invoice.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByOrderId(Long orderId);
    Page<Invoice> findAllByOrderByIssueDateDesc(Pageable pageable);

    @Query(value = """
    SELECT i FROM Invoice i
    JOIN FETCH i.order o
    JOIN FETCH o.user u
    JOIN FETCH o.shippingInfo s
    LEFT JOIN FETCH o.items items
    LEFT JOIN FETCH items.productVariant pv
    LEFT JOIN FETCH pv.product p
    WHERE (:status IS NULL OR :status = '' OR i.status = :status)
      AND (:keyword IS NULL OR :keyword = '' OR
           LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
           LOWER(o.orderCode)     LIKE LOWER(CONCAT('%', :keyword, '%')) OR
           LOWER(u.fullname)      LIKE LOWER(CONCAT('%', :keyword, '%')))
    ORDER BY i.issueDate DESC
    """,
            countQuery = """
    SELECT COUNT(i) FROM Invoice i
    JOIN i.order o
    JOIN o.user u
    WHERE (:status IS NULL OR :status = '' OR i.status = :status)
      AND (:keyword IS NULL OR :keyword = '' OR
           LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
           LOWER(o.orderCode)     LIKE LOWER(CONCAT('%', :keyword, '%')) OR
           LOWER(u.fullname)      LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<Invoice> findAllWithFilters(
            @Param("status")  String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(i.finalAmount), 0) FROM Invoice i WHERE i.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") String status);

    List<Invoice> findAllByStatusAndDueDateBefore(String status, LocalDateTime now);

    @Query("""
        SELECT COALESCE(SUM(i.finalAmount), 0)
        FROM Invoice i
        WHERE i.status = 'PAID'
          AND i.issueDate BETWEEN :from AND :to
    """)
    BigDecimal sumRevenueByPeriod(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
