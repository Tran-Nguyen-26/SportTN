package com.ttn.sporttn.modules.invoice.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceStatsResponse {
    private long invoiceCount;
    private long       paidCount;
    private long       pendingCount;
    private long       overdueCount;
    private BigDecimal totalPaidAmount;
    private BigDecimal totalPendingAmount;
}
