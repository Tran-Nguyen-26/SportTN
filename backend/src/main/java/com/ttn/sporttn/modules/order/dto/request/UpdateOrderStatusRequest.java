package com.ttn.sporttn.modules.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Trạng thái đơn hàng không được để trống")
    private String status; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, etc.
}
