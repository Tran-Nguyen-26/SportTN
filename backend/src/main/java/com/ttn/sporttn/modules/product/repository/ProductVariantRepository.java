package com.ttn.sporttn.modules.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.ProductVariant;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
    long countByStockQuantityGreaterThan(int quantity);

    @Query("""
    SELECT pv FROM ProductVariant pv
    JOIN FETCH pv.product p
    WHERE pv.stockQuantity <= :threshold
    ORDER BY pv.stockQuantity ASC
    """)
    List<ProductVariant> findLowStock(@Param("threshold") int threshold);
}
