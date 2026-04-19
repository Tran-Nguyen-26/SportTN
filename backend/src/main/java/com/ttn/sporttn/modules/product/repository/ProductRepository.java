package com.ttn.sporttn.modules.product.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findTop10ByActiveTrueOrderBySearchCountDesc();

    List<Product> findTop10ByActiveTrueOrderBySoldCountDesc();

    @Query("""
        SELECT p FROM Product p
        JOIN p.variants v
        WHERE p.active = true
        AND v.active = true
        AND v.stockQuantity > 0
        ORDER BY v.salePrice ASC NULLS LAST,
                 v.originalPrice ASC
        """)
    List<Product> findTop10Cheapest(Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.category.id = :categoryId
        AND p.active = true
        ORDER BY p.soldCount DESC
        """)
    List<Product> findTop10ByCategoryIdAndActiveTrueOrderBySoldCountDesc(
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

}
