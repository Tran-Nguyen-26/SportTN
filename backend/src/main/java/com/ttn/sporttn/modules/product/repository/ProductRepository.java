package com.ttn.sporttn.modules.product.repository;

import com.ttn.sporttn.modules.product.dto.response.admin.ProductAdminResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.Product;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

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

    Optional<Product> findBySlug(String slug);

    @Query("SELECT p.id as id, p.name as name, c.name as categoryName, b.name as brandName, " +
            "MIN(v.originalPrice) as minPrice, SUM(v.stockQuantity) as totalStock, " +
            "p.soldCount as soldCount, p.rating as rating, p.active as active, " +
            "p.mainImageUrl as mainImageUrl " +
            "FROM Product p " +
            "LEFT JOIN p.category c " +
            "LEFT JOIN p.brand b " +
            "LEFT JOIN p.variants v " +
            "GROUP BY p.id, p.name, c.name, b.name, p.soldCount, p.rating, p.active, p.mainImageUrl")
    Page<ProductAdminResponse> findAllForAdmin(Pageable pageable);

    @Query("""
    SELECT DISTINCT p FROM Product p
    LEFT JOIN FETCH p.brand b
    LEFT JOIN FETCH p.category c
    WHERE p.active = true
      AND (
        LOWER(p.name)        LIKE LOWER(CONCAT('%', :q, '%')) OR
        LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')) OR
        LOWER(b.name)        LIKE LOWER(CONCAT('%', :q, '%')) OR
        LOWER(c.name)        LIKE LOWER(CONCAT('%', :q, '%'))
      )
    ORDER BY p.soldCount DESC, p.rating DESC
    """)
    Page<Product> searchProducts(@Param("q") String q, Pageable pageable);

}
