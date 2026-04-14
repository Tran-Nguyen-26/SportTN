package com.ttn.sporttn.modules.cart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.cart.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
}
