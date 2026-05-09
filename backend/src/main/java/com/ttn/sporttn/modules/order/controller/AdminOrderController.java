package com.ttn.sporttn.modules.order.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.order.dto.request.UpdateOrderStatusRequest;
import com.ttn.sporttn.modules.order.dto.response.OrderDetailResponse;
import com.ttn.sporttn.modules.order.dto.response.OrderResponse;
import com.ttn.sporttn.modules.order.dto.response.OrderStatsResponse;
import com.ttn.sporttn.modules.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    /** Lấy tất cả đơn hàng có phân trang */
    @GetMapping
    public ApiResponse<Page<OrderResponse>> getAllOrders(Pageable pageable) {
        log.info("[ADMIN-ORDER] Lấy danh sách đơn hàng. page={}", pageable.getPageNumber());
        Page<OrderResponse> response = orderService.getAllOrders(pageable);
        return ApiResponse.ok(response, "Lấy danh sách đơn hàng thành công");
    }

    /** Chi tiết đơn hàng */
    @GetMapping("/{id}")
    public ApiResponse<OrderDetailResponse> getOrderById(@PathVariable Long id) {
        log.info("[ADMIN-ORDER] Lấy chi tiết đơn hàng. orderId={}", id);
        OrderDetailResponse response = orderService.getOrderDetailAdmin(id);
        return ApiResponse.ok(response, "Lấy chi tiết đơn hàng thành công");
    }

    /** Cập nhật trạng thái đơn hàng */
    @PatchMapping("/{id}/status")
    public ApiResponse<OrderResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        log.info("[ADMIN-ORDER] Cập nhật trạng thái. orderId={}, status={}", id, request.getStatus());
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ApiResponse.ok(response, "Cập nhật trạng thái thành công");
    }

    /** Hủy đơn hàng */
    @PostMapping("/{id}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        log.info("[ADMIN-ORDER] Hủy đơn hàng. orderId={}", id);
        OrderResponse response = orderService.adminCancelOrder(id, reason);
        return ApiResponse.ok(response, "Hủy đơn hàng thành công");
    }

    @GetMapping("/summary/stats")
    public ApiResponse<OrderStatsResponse> getOrderStats() {
        log.info("[ADMIN-ORDER] Lấy thống kê đơn hàng");
        OrderStatsResponse stats = orderService.getOrderStats();
        return ApiResponse.ok(stats, "Lấy thống kê đơn hàng thành công");
    }
}