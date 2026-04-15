package com.ttn.sporttn.modules.order.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.order.dto.request.CreateOrderRequest;
import com.ttn.sporttn.modules.order.dto.request.UpdateOrderStatusRequest;
import com.ttn.sporttn.modules.order.dto.response.OrderDetailResponse;
import com.ttn.sporttn.modules.order.dto.response.OrderResponse;
import com.ttn.sporttn.modules.order.service.OrderService;
import com.ttn.sporttn.security.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final OrderService orderService;

    /**
     * Create new order from cart
     * POST /api/v1/orders
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<OrderDetailResponse> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request) {
        log.info("[ORDER] Yêu cầu tạo đơn hàng. userId={}", userDetails.getId());
        
        OrderDetailResponse response = orderService.createOrder(userDetails.getId(), request);
        return ApiResponse.ok(response, "Tạo đơn hàng thành công");
    }

    /**
     * Get user's orders with pagination
     * GET /api/v1/orders?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Page<OrderResponse>> getUserOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Pageable pageable) {
        log.info("[ORDER] Lấy danh sách đơn hàng. userId={}, page={}", userDetails.getId(), pageable.getPageNumber());
        
        Page<OrderResponse> response = orderService.getUserOrders(userDetails.getId(), pageable);
        return ApiResponse.ok(response, "Lấy danh sách đơn hàng thành công");
    }

    /**
     * Get order detail by ID
     * GET /api/v1/orders/{id}
     */
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<OrderDetailResponse> getOrderDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        log.info("[ORDER] Lấy chi tiết đơn hàng. orderId={}, userId={}", id, userDetails.getId());
        
        OrderDetailResponse response = orderService.getOrderDetail(id, userDetails.getId());
        return ApiResponse.ok(response, "Lấy chi tiết đơn hàng thành công");
    }

    /**
     * Update order status (Admin only)
     * PUT /api/v1/orders/{id}/status
     */
    @PutMapping("/{id}/status")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        log.info("[ORDER] Cập nhật trạng thái đơn hàng. orderId={}, status={}", id, request.getStatus());
        
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ApiResponse.ok(response, "Cập nhật trạng thái đơn hàng thành công");
    }

    /**
     * Cancel order
     * POST /api/v1/orders/{id}/cancel
     */
    @PostMapping("/{id}/cancel")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<OrderResponse> cancelOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        log.info("[ORDER] Hủy đơn hàng. orderId={}, userId={}", id, userDetails.getId());
        
        OrderResponse response = orderService.cancelOrder(id, userDetails.getId(), reason);
        return ApiResponse.ok(response, "Hủy đơn hàng thành công");
    }
}
