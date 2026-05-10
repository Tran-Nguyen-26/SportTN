package com.ttn.sporttn.modules.report.controller;

import com.ttn.sporttn.modules.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue")
    public ResponseEntity<byte[]> exportRevenue(
            @RequestParam String from,
            @RequestParam String to) {

        try {
            LocalDate fromDate = LocalDate.parse(from, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            LocalDate toDate   = LocalDate.parse(to,   DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            byte[] pdf = reportService.exportRevenuePdf(fromDate, toDate);

            String filename = "bao-cao-doanh-thu-" + from + "-" + to + ".pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);

        } catch (Exception e) {
            log.error("[REPORT] Lỗi xuất báo cáo doanh thu: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
