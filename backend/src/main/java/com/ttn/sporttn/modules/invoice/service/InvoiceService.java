package com.ttn.sporttn.modules.invoice.service;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.invoice.dto.response.InvoiceResponse;
import com.ttn.sporttn.modules.invoice.dto.response.InvoiceStatsResponse;
import com.ttn.sporttn.modules.invoice.entity.Invoice;
import com.ttn.sporttn.modules.invoice.repository.InvoiceRepository;
import com.ttn.sporttn.modules.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;

    // ── GET ALL ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getAllInvoices(
            String status, String keyword, Pageable pageable) {

        return invoiceRepository
                .findAllWithFilters(status, keyword, pageable)
                .map(InvoiceResponse::from);
    }

    // ── GET BY ID ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND));
        return InvoiceResponse.from(invoice);
    }

    // ── GET BY ORDER ID ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByOrderId(Long orderId) {
        Invoice invoice = invoiceRepository.findByOrderId(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND));
        return InvoiceResponse.from(invoice);
    }

    // ── UPDATE STATUS ─────────────────────────────────────────────────────────

    @Transactional
    public InvoiceResponse updateStatus(Long id, String status) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVOICE_NOT_FOUND));

        invoice.setStatus(status);
        log.info("[INVOICE] Cập nhật trạng thái. id={}, status={}", id, status);

        return InvoiceResponse.from(invoiceRepository.save(invoice));
    }

    // ── STATS ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public InvoiceStatsResponse getStats() {
        return InvoiceStatsResponse.builder()
                .invoiceCount(invoiceRepository.count())
                .paidCount(invoiceRepository.countByStatus("PAID"))
                .pendingCount(invoiceRepository.countByStatus("PENDING"))
                .overdueCount(invoiceRepository.countByStatus("OVERDUE"))
                .totalPaidAmount(invoiceRepository.sumAmountByStatus("PAID"))
                .totalPendingAmount(invoiceRepository.sumAmountByStatus("PENDING"))
                .build();
    }

    // ── CHECK OVERDUE (chạy định kỳ) ─────────────────────────────────────────

    @Transactional
    public void checkAndMarkOverdue() {
        List<Invoice> overdueInvoices = invoiceRepository
                .findAllByStatusAndDueDateBefore("PENDING", LocalDateTime.now());

        overdueInvoices.forEach(inv -> inv.setStatus("OVERDUE"));
        invoiceRepository.saveAll(overdueInvoices);

        log.info("[INVOICE] Đánh dấu quá hạn: {} hóa đơn", overdueInvoices.size());
    }
}
