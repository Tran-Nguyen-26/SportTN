package com.ttn.sporttn.modules.product.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ttn.sporttn.modules.product.entity.InventoryLog;
import com.ttn.sporttn.modules.product.entity.ProductVariant;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    List<InventoryLog> findByProductVariantOrderByCreatedAtDesc(ProductVariant productVariant);
    
    List<InventoryLog> findByProductVariantAndCreatedAtBetweenOrderByCreatedAtDesc(
            ProductVariant productVariant, LocalDateTime startDate, LocalDateTime endDate);
    
    List<InventoryLog> findByActionTypeOrderByCreatedAtDesc(String actionType);
}
