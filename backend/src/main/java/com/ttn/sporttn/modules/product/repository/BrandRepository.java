package com.ttn.sporttn.modules.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    
}