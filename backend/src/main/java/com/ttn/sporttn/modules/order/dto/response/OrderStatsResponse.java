package com.ttn.sporttn.modules.order.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatsResponse {
    private long pending;
    private long confirmed;
    private long shipping;
    private long delivered;
    private long cancelled;
}
