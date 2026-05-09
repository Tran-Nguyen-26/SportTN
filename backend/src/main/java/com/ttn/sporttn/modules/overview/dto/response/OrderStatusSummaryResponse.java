package com.ttn.sporttn.modules.overview.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusSummaryResponse {
    private String status;
    private Long count;
}
