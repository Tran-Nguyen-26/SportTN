package com.ttn.sporttn.modules.payment.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ttn.sporttn.modules.payment.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find payment by order ID
     */
    Optional<Payment> findByOrderId(Long orderId);

    /**
     * Find payment by transaction ID
     */
    Optional<Payment> findByTransactionId(String transactionId);

    /**
     * Get payments by status with pagination
     */
    Page<Payment> findByPaymentStatusOrderByCreatedAtDesc(String paymentStatus, Pageable pageable);

    /**
     * Get payments by payment method with pagination
     */
    Page<Payment> findByPaymentMethodOrderByCreatedAtDesc(String paymentMethod, Pageable pageable);

    /**
     * Count payments by status
     */
    long countByPaymentStatus(String paymentStatus);

    /**
     * Count payments by payment method
     */
    long countByPaymentMethod(String paymentMethod);

    /**
     * Find payments created after a specific date
     */
    Page<Payment> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date, Pageable pageable);

    Optional<Payment> findByOrderIdAndPaymentStatus(Long orderId, String status);
}
