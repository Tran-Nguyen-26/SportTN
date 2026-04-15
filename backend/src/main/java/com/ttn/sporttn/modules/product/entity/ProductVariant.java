package com.ttn.sporttn.modules.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "sale_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "weight_gram")
    private Integer weightGram;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariantImage> variantImages;

    public BigDecimal getEffectivePrice() {
        if (salePrice != null && salePrice.compareTo(originalPrice) < 0) {
            return salePrice;
        }
        return originalPrice;
    }

    public void addImage(ProductVariantImage image) {
        variantImages.add(image);
        image.setVariant(this);
    }

}
