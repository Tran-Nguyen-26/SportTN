package com.ttn.sporttn.modules.order.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotEmpty(message = "Giỏ hàng không được để trống")
    private List<OrderItemRequest> items;

    @NotNull(message = "Địa chỉ giao hàng không được để trống")
    private Long addressId;

    private Long voucherId;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod; // CASH, CREDIT_CARD, E_WALLET, etc.

    @Size(max = 500, message = "Ghi chú không quá 500 ký tự")
    private String customerNote;

    private Integer pointsToUse;
}
