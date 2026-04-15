package com.ttn.sporttn.modules.payment.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.order.entity.Order;
import com.ttn.sporttn.modules.order.repository.OrderRepository;
import com.ttn.sporttn.modules.payment.dto.request.ProcessPaymentRequest;
import com.ttn.sporttn.modules.payment.dto.request.RefundPaymentRequest;
import com.ttn.sporttn.modules.payment.dto.response.PaymentResponse;
import com.ttn.sporttn.modules.payment.entity.Payment;
import com.ttn.sporttn.modules.payment.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    /**
     * Process payment for an order (Cash/COD support)
     */
    @Transactional
    public PaymentResponse processPayment(ProcessPaymentRequest request) {
        log.info("[PAYMENT] Xử lý thanh toán. orderId={}, method={}, amount={}",
            request.getOrderId(), request.getPaymentMethod(), request.getAmount());

        // Get order
        Order order = orderRepository.findById(request.getOrderId())
            .orElseThrow(() -> {
                log.warn("[PAYMENT] Đơn hàng không tìm thấy. orderId={}", request.getOrderId());
                return new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        // Check if payment already exists
        if (paymentRepository.findByOrderId(request.getOrderId()).isPresent()) {
            log.warn("[PAYMENT] Thanh toán đã tồn tại cho đơn hàng. orderId={}", request.getOrderId());
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        // Validate amount
        if (!request.getAmount().equals(order.getFinalAmount())) {
            log.warn("[PAYMENT] Số tiền không khớp. expected={}, received={}",
                order.getFinalAmount(), request.getAmount());
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        // Process payment based on method
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(request.getAmount());

        if ("CASH".equals(request.getPaymentMethod()) || "COD".equals(request.getPaymentMethod())) {
            // Cash on Delivery - mark as pending, will be completed when delivered
            log.info("[PAYMENT] Thanh toán bằng tiền mặt (COD). orderId={}", request.getOrderId());
            payment.setPaymentStatus("PENDING");
            payment.setTransactionId("COD-" + System.currentTimeMillis());
        } else if ("MOMO".equals(request.getPaymentMethod())) {
            // Mock MOMO payment
            log.info("[PAYMENT] MOMO payment. transactionId={}", request.getTransactionId());
            payment.setTransactionId(request.getTransactionId());
            payment.setPaymentStatus("COMPLETED");
            payment.setPaidAt(LocalDateTime.now());
        } else if ("VNPAY".equals(request.getPaymentMethod())) {
            // Mock VNPAY payment
            log.info("[PAYMENT] VNPAY payment. transactionId={}", request.getTransactionId());
            payment.setTransactionId(request.getTransactionId());
            payment.setPaymentStatus("COMPLETED");
            payment.setPaidAt(LocalDateTime.now());
        } else {
            log.warn("[PAYMENT] Phương thức thanh toán không hỗ trợ. method={}", request.getPaymentMethod());
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        payment.setCreatedAt(LocalDateTime.now());

        // Save payment
        Payment savedPayment = paymentRepository.save(payment);

        // Update order payment status
        if ("COMPLETED".equals(payment.getPaymentStatus())) {
            order.setPaymentStatus("PAID");
        } else {
            order.setPaymentStatus("UNPAID");
        }
        orderRepository.save(order);

        log.info("[PAYMENT] Xử lý thanh toán thành công. paymentId={}, status={}, orderId={}",
            savedPayment.getId(), savedPayment.getPaymentStatus(), request.getOrderId());

        return PaymentResponse.from(savedPayment);
    }

    /**
     * Get payment by ID
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPayment(Long paymentId) {
        log.info("[PAYMENT] Lấy thông tin thanh toán. paymentId={}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> {
                log.warn("[PAYMENT] Thanh toán không tìm thấy. paymentId={}", paymentId);
                return new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        return PaymentResponse.from(payment);
    }

    /**
     * Get payment by order ID
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrder(Long orderId) {
        log.info("[PAYMENT] Lấy thanh toán theo đơn hàng. orderId={}", orderId);

        Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> {
                log.warn("[PAYMENT] Thanh toán không tìm thấy cho đơn hàng. orderId={}", orderId);
                return new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        return PaymentResponse.from(payment);
    }

    /**
     * Get all payments with pagination
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        log.info("[PAYMENT] Lấy danh sách thanh toán. page={}", pageable.getPageNumber());
        return paymentRepository.findAll(pageable).map(PaymentResponse::from);
    }

    /**
     * Get payments by status
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsByStatus(String status, Pageable pageable) {
        log.info("[PAYMENT] Lấy thanh toán theo trạng thái. status={}, page={}", status, pageable.getPageNumber());
        return paymentRepository.findByPaymentStatusOrderByCreatedAtDesc(status, pageable)
            .map(PaymentResponse::from);
    }

    /**
     * Get payments by method
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsByMethod(String method, Pageable pageable) {
        log.info("[PAYMENT] Lấy thanh toán theo phương thức. method={}, page={}", method, pageable.getPageNumber());
        return paymentRepository.findByPaymentMethodOrderByCreatedAtDesc(method, pageable)
            .map(PaymentResponse::from);
    }

    /**
     * Complete pending COD payment (when order is delivered)
     */
    @Transactional
    public PaymentResponse completeCODPayment(Long paymentId) {
        log.info("[PAYMENT] Hoàn thành thanh toán COD. paymentId={}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> {
                log.warn("[PAYMENT] Thanh toán không tìm thấy. paymentId={}", paymentId);
                return new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        // Check if it's COD payment
        if (!"COD".equals(payment.getPaymentMethod()) && !"CASH".equals(payment.getPaymentMethod())) {
            log.warn("[PAYMENT] Chỉ có thể hoàn thành thanh toán COD. paymentId={}, method={}",
                paymentId, payment.getPaymentMethod());
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        payment.setPaymentStatus("COMPLETED");
        payment.setPaidAt(LocalDateTime.now());
        Payment updated = paymentRepository.save(payment);

        // Update order payment status
        Order order = payment.getOrder();
        order.setPaymentStatus("PAID");
        orderRepository.save(order);

        log.info("[PAYMENT] Hoàn thành thanh toán COD thành công. paymentId={}", paymentId);
        return PaymentResponse.from(updated);
    }

    /**
     * Refund payment
     */
    @Transactional
    public PaymentResponse refundPayment(RefundPaymentRequest request) {
        log.info("[PAYMENT] Hoàn lại thanh toán. paymentId={}, reason={}", request.getPaymentId(), request.getReason());

        Payment payment = paymentRepository.findById(request.getPaymentId())
            .orElseThrow(() -> {
                log.warn("[PAYMENT] Thanh toán không tìm thấy. paymentId={}", request.getPaymentId());
                return new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        // Check if payment can be refunded
        if (!"COMPLETED".equals(payment.getPaymentStatus())) {
            log.warn("[PAYMENT] Chỉ có thể hoàn lại thanh toán COMPLETED. paymentId={}, status={}",
                request.getPaymentId(), payment.getPaymentStatus());
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        payment.setPaymentStatus("REFUNDED");
        Payment updated = paymentRepository.save(payment);

        log.info("[PAYMENT] Hoàn lại thanh toán thành công. paymentId={}", request.getPaymentId());
        return PaymentResponse.from(updated);
    }

    /**
     * Count payments by status (for admin dashboard)
     */
    @Transactional(readOnly = true)
    public long countByStatus(String status) {
        return paymentRepository.countByPaymentStatus(status);
    }

    /**
     * Count payments by method (for statistics)
     */
    @Transactional(readOnly = true)
    public long countByMethod(String method) {
        return paymentRepository.countByPaymentMethod(method);
    }
}
