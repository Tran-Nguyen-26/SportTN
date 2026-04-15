package com.ttn.sporttn.modules.payment.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.payment.dto.request.ProcessPaymentRequest;
import com.ttn.sporttn.modules.payment.dto.request.RefundPaymentRequest;
import com.ttn.sporttn.modules.payment.dto.response.PaymentResponse;
import com.ttn.sporttn.modules.payment.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Process payment (Cash/COD, MOMO, VNPAY)
     * POST /api/v1/payments/process
     */
    @PostMapping("/process")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PaymentResponse> processPayment(
            @Valid @RequestBody ProcessPaymentRequest request) {
        log.info("[PAYMENT] Yêu cầu xử lý thanh toán. orderId={}, method={}", 
            request.getOrderId(), request.getPaymentMethod());
        
        PaymentResponse response = paymentService.processPayment(request);
        return ApiResponse.ok(response, "Xử lý thanh toán thành công");
    }

    /**
     * Get payment detail by ID
     * GET /api/v1/payments/{id}
     */
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PaymentResponse> getPayment(@PathVariable Long id) {
        log.info("[PAYMENT] Lấy chi tiết thanh toán. paymentId={}", id);
        
        PaymentResponse response = paymentService.getPayment(id);
        return ApiResponse.ok(response, "Lấy thông tin thanh toán thành công");
    }

    /**
     * Get payment by order ID
     * GET /api/v1/payments/order/{orderId}
     */
    @GetMapping("/order/{orderId}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<PaymentResponse> getPaymentByOrder(@PathVariable Long orderId) {
        log.info("[PAYMENT] Lấy thanh toán theo đơn hàng. orderId={}", orderId);
        
        PaymentResponse response = paymentService.getPaymentByOrder(orderId);
        return ApiResponse.ok(response, "Lấy thông tin thanh toán thành công");
    }

    /**
     * Get all payments (Admin only)
     * GET /api/v1/payments?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<PaymentResponse>> getAllPayments(Pageable pageable) {
        log.info("[PAYMENT] Lấy danh sách thanh toán. page={}", pageable.getPageNumber());
        
        Page<PaymentResponse> response = paymentService.getAllPayments(pageable);
        return ApiResponse.ok(response, "Lấy danh sách thanh toán thành công");
    }

    /**
     * Get payments by status (Admin only)
     * GET /api/v1/payments/status/{status}?page=0&size=10
     */
    @GetMapping("/status/{status}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<PaymentResponse>> getPaymentsByStatus(
            @PathVariable String status,
            Pageable pageable) {
        log.info("[PAYMENT] Lấy thanh toán theo trạng thái. status={}, page={}",
            status, pageable.getPageNumber());
        
        Page<PaymentResponse> response = paymentService.getPaymentsByStatus(status, pageable);
        return ApiResponse.ok(response, "Lấy danh sách thanh toán thành công");
    }

    /**
     * Get payments by method (Admin only)
     * GET /api/v1/payments/method/{method}?page=0&size=10
     */
    @GetMapping("/method/{method}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<PaymentResponse>> getPaymentsByMethod(
            @PathVariable String method,
            Pageable pageable) {
        log.info("[PAYMENT] Lấy thanh toán theo phương thức. method={}, page={}",
            method, pageable.getPageNumber());
        
        Page<PaymentResponse> response = paymentService.getPaymentsByMethod(method, pageable);
        return ApiResponse.ok(response, "Lấy danh sách thanh toán thành công");
    }

    /**
     * Complete COD payment (when order is delivered)
     * POST /api/v1/payments/{id}/complete-cod
     */
    @PostMapping("/{id}/complete-cod")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PaymentResponse> completeCODPayment(@PathVariable Long id) {
        log.info("[PAYMENT] Hoàn thành thanh toán COD. paymentId={}", id);
        
        PaymentResponse response = paymentService.completeCODPayment(id);
        return ApiResponse.ok(response, "Hoàn thành thanh toán COD thành công");
    }

    /**
     * Refund payment (Admin only)
     * POST /api/v1/payments/refund
     */
    @PostMapping("/refund")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PaymentResponse> refundPayment(
            @Valid @RequestBody RefundPaymentRequest request) {
        log.info("[PAYMENT] Yêu cầu hoàn lại thanh toán. paymentId={}, reason={}",
            request.getPaymentId(), request.getReason());
        
        PaymentResponse response = paymentService.refundPayment(request);
        return ApiResponse.ok(response, "Hoàn lại thanh toán thành công");
    }
}
