package com.ttn.sporttn.modules.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "product_variants", indexes = {
        @Index(name = "idx_variants_sku",          columnList = "sku"),
        @Index(name = "idx_variants_product_id",   columnList = "product_id"),
        @Index(name = "idx_variants_active",       columnList = "active"),
        @Index(name = "idx_variants_stock",        columnList = "stock_quantity"),
        @Index(name = "idx_variants_original_price", columnList = "original_price"),
        @Index(name = "idx_variants_sale_price",   columnList = "sale_price"),
        @Index(name = "idx_variants_product_active", columnList = "product_id, active")
})
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(length = 50)
    private String color;

    @Column(length = 20)
    private String size;

    @Column(name = "original_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "sale_price", precision = 18, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "weight_gram")
    private Integer weightGram;

    @Column(name = "sold_quantity")
    private Integer soldQuantity = 0;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "main_image_url")
    private String mainImageUrl;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariantImage> variantImages;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public BigDecimal getEffectivePrice() {
        if (isOnSale()) {
            return salePrice;
        }
        return originalPrice;
    }

    public void addImage(ProductVariantImage image) {
        variantImages.add(image);
        image.setVariant(this);
    }

    public boolean isOnSale() {
        return salePrice != null
                && salePrice.compareTo(BigDecimal.ZERO) > 0
                && salePrice.compareTo(originalPrice) < 0;
    }

    public Integer getDiscountPercent() {
        if(!isOnSale()) return 0;
        return originalPrice
                .subtract(salePrice)
                .multiply(BigDecimal.valueOf(100))
                .divide(originalPrice, 0, RoundingMode.HALF_UP)
                .intValue();
    }

    public boolean isInStock() {
        return stockQuantity != null && stockQuantity > 0;
    }

    public void increaseSoldQuantity(int quantity) {
        this.soldQuantity += quantity;
    }
}
