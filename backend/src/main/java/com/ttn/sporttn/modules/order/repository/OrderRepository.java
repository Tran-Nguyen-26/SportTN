package com.ttn.sporttn.modules.order.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ttn.sporttn.modules.order.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find order by order code
     */
    Optional<Order> findByOrderCode(String orderCode);

    /**
     * Find all orders by user ID with pagination
     */
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * Find all orders by user ID and status
     */
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status, Pageable pageable);

    /**
     * Find all orders by status
     */
    Page<Order> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    /**
     * Find all pending orders (for admin dashboard)
     */
    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' ORDER BY o.createdAt DESC")
    List<Order> findPendingOrders();

    /**
     * Find orders by payment status
     */
    Page<Order> findByPaymentStatusOrderByCreatedAtDesc(String paymentStatus, Pageable pageable);

    /**
     * Count orders by user
     */
    long countByUserId(Long userId);

    /**
     * Count orders by status
     */
    long countByStatus(String status);
}
