package com.ttn.sporttn.modules.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
