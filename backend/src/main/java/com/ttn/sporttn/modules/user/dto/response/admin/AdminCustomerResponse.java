package com.ttn.sporttn.modules.user.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminCustomerResponse {

    private Long id;
    private String username;
    private String fullName;
    private String initials;
    private String email;
    private String phone;

    private Long totalOrders;
    private BigDecimal totalSpent;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime joinDate;

    private String status; // ACTIVE, INACTIVE
    private String address;
    private String gender; // MALE, FEMALE
    private String birthday;
    private String note;
    private List<CustomerOrderResponse> orderHistory;
}