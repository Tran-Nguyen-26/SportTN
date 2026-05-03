package com.ttn.sporttn.modules.order.entity;

import com.ttn.sporttn.modules.invoice.entity.Invoice;
import com.ttn.sporttn.modules.user.entity.User;
import com.ttn.sporttn.modules.voucher.entity.Voucher;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "voucher_id")
    private Long voucherId;

    // Mapping read-only theo voucher_id để truy cập dữ liệu voucher khi cần
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", insertable = false, updatable = false)
    private Voucher voucher;

    @Column(name = "order_code", nullable = false, unique = true, length = 20)
    private String orderCode;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "shipping_fee", precision = 18, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "voucher_discount", precision = 18, scale = 2)
    private BigDecimal voucherDiscount = BigDecimal.ZERO;

    @Column(name = "points_discount_amount", precision = 18, scale = 2)
    private BigDecimal pointsDiscountAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "points_earned")
    private Integer pointsEarned = 0;

    @Column(name = "points_used")
    private Integer pointsUsed = 0;

    @Column(length = 30)
    private String status = "PENDING";

    @Column(name = "payment_method", length = 30)
    private String paymentMethod;

    @Column(name = "payment_status", length = 30)
    private String paymentStatus = "UNPAID";

    @Column(name = "customer_note", length = 500)
    private String customerNote;

    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Invoice invoice;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private ShippingInfo shippingInfo;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        if (this.shippingFee == null) this.shippingFee = BigDecimal.ZERO;
        if (this.voucherDiscount == null) this.voucherDiscount = BigDecimal.ZERO;
        if (this.pointsDiscountAmount == null) this.pointsDiscountAmount = BigDecimal.ZERO;
        if (this.pointsEarned == null) this.pointsEarned = 0;
        if (this.pointsUsed == null) this.pointsUsed = 0;
        if (this.status == null) this.status = "PENDING";
        if (this.paymentStatus == null) this.paymentStatus = "UNPAID";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}