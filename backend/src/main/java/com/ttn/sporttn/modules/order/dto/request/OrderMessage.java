package com.ttn.sporttn.modules.order.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderMessage {
    private Long userId;
    private Long addressId;
    private Long voucherId;
    private String paymentMethod;
    private String customerNote;
    private Integer pointsToUse;
    private List<OrderItemRequest> items;

}
