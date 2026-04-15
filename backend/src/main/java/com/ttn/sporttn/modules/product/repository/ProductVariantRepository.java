package com.ttn.sporttn.modules.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.ProductVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    
}
