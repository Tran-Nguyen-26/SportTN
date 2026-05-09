package com.ttn.sporttn.modules.order.controller;

import com.ttn.sporttn.modules.order.dto.request.OrderMessage;
import com.ttn.sporttn.modules.order.producer.OrderProducer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    private final OrderProducer orderProducer;
    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApiResponse<?>> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request) {
        log.info("[ORDER] Yêu cầu tạo đơn hàng. userId={}", userDetails.getId());

        OrderMessage message = new OrderMessage(
                userDetails.getId(),
                request.getAddressId(),
                request.getVoucherId(),
                request.getPaymentMethod(),
                request.getCustomerNote(),
                request.getPointsToUse(),
                request.getItems()
        );

        orderProducer.sendOrder(message);

        return ResponseEntity.accepted()
                .body(ApiResponse.ok("Đơn hàng đang được xử lý"));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Page<OrderResponse>> getUserOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Pageable pageable) {
        log.info("[ORDER] Lấy danh sách đơn hàng. userId={}, page={}", userDetails.getId(), pageable.getPageNumber());
        
        Page<OrderResponse> response = orderService.getUserOrders(userDetails.getId(), pageable);
        return ApiResponse.ok(response, "Lấy danh sách đơn hàng thành công");
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<OrderDetailResponse> getOrderDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        log.info("[ORDER] Lấy chi tiết đơn hàng. orderId={}, userId={}", id, userDetails.getId());
        
        OrderDetailResponse response = orderService.getOrderDetail(id, userDetails.getId());
        return ApiResponse.ok(response, "Lấy chi tiết đơn hàng thành công");
    }


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
