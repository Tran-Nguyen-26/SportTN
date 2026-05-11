package com.ttn.sporttn.modules.cart.entity;

import java.time.LocalDateTime;

import com.ttn.sporttn.modules.product.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "cart_items", indexes = {
        @Index(name = "idx_cart_items_cart_id",    columnList = "cart_id"),
        @Index(name = "idx_cart_items_variant_id", columnList = "variant_id"),
        @Index(name = "idx_cart_items_cart_variant", columnList = "cart_id, variant_id")
})
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt = LocalDateTime.now();
}