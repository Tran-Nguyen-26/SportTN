package com.ttn.sporttn.modules.payment.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessPaymentRequest {

    @NotNull(message = "Order ID không được để trống")
    private Long orderId;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod; // "CASH", "MOMO", "VNPAY"

    @NotNull(message = "Số tiền không được để trống")
    @Positive(message = "Số tiền phải lớn hơn 0")
    private BigDecimal amount;

    private String transactionId; // Optional for CASH

    private String notes; // Optional notes

    private String bankCode; // For bank transfer

    private String cardNumber; // For card payment (masked)
}
