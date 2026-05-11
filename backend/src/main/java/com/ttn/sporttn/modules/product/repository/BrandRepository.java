package com.ttn.sporttn.modules.product.repository;

import com.ttn.sporttn.modules.product.dto.response.admin.BrandResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.Brand;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long brandId);

    boolean existsBySlugAndIdNot(String slug, Long brandId);

    boolean existsBySlug(String slug);

    @Query("""
        SELECT new com.ttn.sporttn.modules.product.dto.response.admin.BrandResponse(
            b.id,
            b.name,
            b.slug,
            b.color,
            b.logoUrl,
            b.websiteUrl,
            b.description,
            b.active,
            COUNT(p.id)
        )
        FROM Brand b
        LEFT JOIN b.products p
        GROUP BY
            b.id,
            b.name,
            b.slug,
            b.color,
            b.logoUrl,
            b.websiteUrl,
            b.description,
            b.active
        """)
    List<BrandResponse> findAllBrandResponses();
}