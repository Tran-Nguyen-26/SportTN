package com.ttn.sporttn.modules.overview.dto.response;

import com.ttn.sporttn.modules.order.entity.Order;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentOrderResponse {
    private Long id;
    private String orderCode;
    private String receiverName;
    private int itemCount;
    private BigDecimal finalAmount;
    private String status;
    private LocalDateTime createdAt;

    public static RecentOrderResponse from(Order order) {
        return RecentOrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .receiverName(order.getShippingInfo().getReceiverName())
                .itemCount(order.getItems().size())
                .finalAmount(order.getFinalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
