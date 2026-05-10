package com.ttn.sporttn.modules.report.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueRowBean {
    private String day;
    private String revenue;
    private Long   orders;
}
