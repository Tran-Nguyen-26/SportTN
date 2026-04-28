package com.ttn.sporttn.modules.invoice.entity;

import com.ttn.sporttn.modules.order.entity.Order;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber; // Sẽ map vào id: string trong FE (INV-001)

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private LocalDateTime issueDate; // Ngày xuất hóa đơn
    private LocalDateTime dueDate;   // Hạn thanh toán (Dùng để check OVERDUE)

    private BigDecimal subtotal;      // Tổng tiền trước thuế
    private BigDecimal taxAmount;     // Tiền thuế
    private BigDecimal finalAmount;   // Tổng cộng cuối cùng (Bằng Order.finalAmount)

    @Column(length = 30)
    private String status; // PAID, PENDING, OVERDUE

    private String note; // Ghi chú riêng cho hóa đơn
}