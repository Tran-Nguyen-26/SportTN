package com.ttn.sporttn.modules.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.ProductVariant;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
}
