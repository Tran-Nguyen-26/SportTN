package com.ttn.sporttn.modules.order.repository;

import com.ttn.sporttn.modules.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    boolean existsByProductVariant_Product_Id(Long id);
}
