package com.ttn.sporttn.modules.product.entity;

import com.ttn.sporttn.modules.category.entity.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, length = 100)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "main_image_url")
    private String mainImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    @Column(nullable = false, columnDefinition = "float default 0")
    private Double rating = 0.0;

    @Column(name = "review_count", nullable = false, columnDefinition = "int default 0")
    private Integer reviewCount = 0;

    @Column(name = "sold_count", nullable = false, columnDefinition = "int default 0")
    private Integer soldCount = 0;

    @Column(name = "search_count", nullable = false, columnDefinition = "int default 0")
    private Integer searchCount = 0;

    private boolean active;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    public void updateRating(double newRating) {
        double total = this.rating * this.reviewCount + newRating;
        this.reviewCount++;
        this.rating = total / this.reviewCount;
    }

    public void increaseSoldCount(int quantity) {
        this.searchCount += quantity;
    }

    public void increaseSearchCount() {
        this.searchCount++;
    }
}
