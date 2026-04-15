package com.ttn.sporttn.modules.payment.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class RefundPaymentRequest {

    @NotNull(message = "Payment ID không được để trống")
    private Long paymentId;

    @Positive(message = "Số tiền hoàn lại phải lớn hơn 0")
    private BigDecimal amount; // Optional, if null = full refund

    @NotBlank(message = "Lý do hoàn lại không được để trống")
    private String reason;

    private String notes;
}
