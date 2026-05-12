package com.ttn.sporttn.modules.invoice.controller;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.common.dto.PageResponse;
import com.ttn.sporttn.modules.invoice.dto.response.InvoiceResponse;
import com.ttn.sporttn.modules.invoice.dto.response.InvoiceStatsResponse;
import com.ttn.sporttn.modules.invoice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/invoices")
@RequiredArgsConstructor
public class AdminInvoiceController {

    private final InvoiceService invoiceService;

    /** Lấy danh sách hóa đơn có phân trang + filter */
    @GetMapping
    public ApiResponse<PageResponse<InvoiceResponse>> getAllInvoices(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("[ADMIN-INVOICE] Lấy danh sách hóa đơn. status={}, keyword={}, page={}, size={}",
                status, keyword, page, size);
//        Pageable pageable = PageRequest.of(page, size, Sort.by("issueDate").descending());
        Pageable pageable = PageRequest.of(page, size, Sort.unsorted());
        Page<InvoiceResponse> result = invoiceService.getAllInvoices(status, keyword, pageable);


        return ApiResponse.ok(PageResponse.from(result), "Lấy danh sách hóa đơn thành công");
    }

    /** Chi tiết hóa đơn */
    @GetMapping("/{id}")
    public ApiResponse<InvoiceResponse> getInvoiceById(@PathVariable Long id) {
        log.info("[ADMIN-INVOICE] Lấy chi tiết hóa đơn. id={}", id);
        return ApiResponse.ok(
                invoiceService.getInvoiceById(id),
                "Lấy chi tiết hóa đơn thành công"
        );
    }

    /** Lấy hóa đơn theo orderId */
    @GetMapping("/order/{orderId}")
    public ApiResponse<InvoiceResponse> getInvoiceByOrderId(@PathVariable Long orderId) {
        log.info("[ADMIN-INVOICE] Lấy hóa đơn theo đơn hàng. orderId={}", orderId);
        return ApiResponse.ok(
                invoiceService.getInvoiceByOrderId(orderId),
                "Lấy hóa đơn thành công"
        );
    }

    /** Cập nhật trạng thái hóa đơn */
    @PatchMapping("/{id}/status")
    public ApiResponse<InvoiceResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        log.info("[ADMIN-INVOICE] Cập nhật trạng thái hóa đơn. id={}, status={}", id, status);
        return ApiResponse.ok(
                invoiceService.updateStatus(id, status),
                "Cập nhật trạng thái thành công"
        );
    }

    /** Thống kê hóa đơn */
    @GetMapping("/summary/stats")
    public ApiResponse<InvoiceStatsResponse> getStats() {
        log.info("[ADMIN-INVOICE] Lấy thống kê hóa đơn");
        return ApiResponse.ok(
                invoiceService.getStats(),
                "Lấy thống kê thành công"
        );
    }
}
