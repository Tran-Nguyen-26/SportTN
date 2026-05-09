package com.ttn.sporttn.modules.order.dto.response;

import com.ttn.sporttn.modules.order.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailResponse {

    private Long id;
    private String orderCode;
    private Long userId;
    private String username;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private BigDecimal voucherDiscount;
    private BigDecimal pointsDiscountAmount;
    private BigDecimal finalAmount;
    private Integer pointsEarned;
    private Integer pointsUsed;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String customerNote;
    private String cancelReason;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    private ShippingInfoResponse shippingInfo;

    public static OrderDetailResponse from(Order order) {
        List<OrderItemResponse> items = order.getItems() != null
            ? order.getItems().stream()
                .map(OrderItemResponse::from)
                .collect(Collectors.toList())
            : List.of();

        return OrderDetailResponse.builder()
            .id(order.getId())
            .orderCode(order.getOrderCode())
            .userId(order.getUser().getId())
            .username(order.getUser().getUsername())
            .totalAmount(order.getTotalAmount())
            .shippingFee(order.getShippingFee())
            .voucherDiscount(order.getVoucherDiscount())
            .pointsDiscountAmount(order.getPointsDiscountAmount())
            .finalAmount(order.getFinalAmount())
            .pointsEarned(order.getPointsEarned())
            .pointsUsed(order.getPointsUsed())
            .status(order.getStatus())
            .paymentMethod(order.getPaymentMethod())
            .paymentStatus(order.getPaymentStatus())
            .customerNote(order.getCustomerNote())
            .cancelReason(order.getCancelReason())
            .createdAt(order.getCreatedAt())
            .items(items)
            .shippingInfo(ShippingInfoResponse.from(order.getShippingInfo()))
            .build();
    }
}
