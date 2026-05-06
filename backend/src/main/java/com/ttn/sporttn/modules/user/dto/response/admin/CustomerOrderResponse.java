package com.ttn.sporttn.modules.user.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrderResponse {

    private String id; // #DH001
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime date;
    private BigDecimal total;
    private String status; // DELIVERED, SHIPPING, PENDING, CANCELLED
    private Integer items;
}