package com.ttn.sporttn.modules.user.dto.response.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.ttn.sporttn.modules.user.entity.User;
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

    public static AdminCustomerResponse from(User user) {
        return AdminCustomerResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullname())
                .initials(buildInitials(user.getFullname()))
                .email(user.getEmail())
                .phone(user.getPhone())
                .joinDate(user.getCreatedAt())
                .status(user.getStatus().name())
                .build();
    }

    private static String buildInitials(String fullname) {
        if (fullname == null || fullname.isBlank()) return "?";
        String normalized = fullname
                .trim()
                .replaceAll("\\s+", " ");
        String[] words = normalized.split(" ");
        if (words.length >= 2) {
            return (words[0].charAt(0) + "" + words[words.length - 1].charAt(0)).toUpperCase();
        }
        return words[0].substring(0, Math.min(2, words[0].length())).toUpperCase();
    }
}