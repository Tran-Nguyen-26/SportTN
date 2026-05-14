package com.ttn.sporttn.modules.order.entity;

import com.ttn.sporttn.modules.product.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "order_items", indexes = {
        @Index(name = "idx_order_items_order_id",   columnList = "order_id"),
        @Index(name = "idx_order_items_variant_id", columnList = "variant_id")
})
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = true)
    private ProductVariant productVariant;

    @Column(name = "snapshot_name")
    private String snapshotName;

    @Column(name = "snapshot_image_url")
    private String snapshotImageUrl;

    @Column(name = "snapshot_sku", length = 50)
    private String snapshotSku;

    @Column(name = "snapshot_color", length = 50)
    private String snapshotColor;

    @Column(name = "snapshot_size", length = 20)
    private String snapshotSize;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_at_purchase", nullable = false, precision = 18, scale = 2)
    private BigDecimal priceAtPurchase;
}