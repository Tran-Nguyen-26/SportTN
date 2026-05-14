package com.ttn.sporttn.modules.product.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.product.dto.response.InventoryLogResponse;
import com.ttn.sporttn.modules.product.dto.response.StockResponse;
import com.ttn.sporttn.modules.product.entity.InventoryLog;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
import com.ttn.sporttn.modules.product.repository.InventoryLogRepository;
import com.ttn.sporttn.modules.product.repository.ProductRepository;
import com.ttn.sporttn.modules.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventorySerivce {
    
    private final ProductRepository productRepository;
    private final InventoryLogRepository inventoryLogRepository;
    
    @Value("${inventory.low-stock-threshold:10}")
    private Integer lowStockThreshold;

    @Transactional
    public StockResponse decreaseStock(Long variantId, Integer quantity, User user, String reason) {
        if (quantity == null || quantity <= 0) {
            throw new BusinessException(ErrorCode.INVALID_QUANTITY);
        }

        ProductVariant variant = productRepository.findById(variantId)
                .map(product -> product.getVariants().stream()
                        .filter(v -> v.getId().equals(variantId))
                        .findFirst()
                        .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND)))
                .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

        if (variant.getStockQuantity() < quantity) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
        }

        variant.setStockQuantity(variant.getStockQuantity() - quantity);

        createInventoryLog(variant, -quantity, "EXPORT_ORDER", user, reason);

        return buildStockResponse(variant);
    }

    @Transactional
    public StockResponse increaseStock(Long variantId, Integer quantity, User user, String actionType, String reason) {
        if (quantity == null || quantity <= 0) {
            throw new BusinessException(ErrorCode.INVALID_QUANTITY);
        }

        if (actionType == null || 
            (!actionType.equals("IMPORT") && !actionType.equals("RETURN") && !actionType.equals("ADJUSTMENT"))) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        ProductVariant variant = productRepository.findById(variantId)
                .map(product -> product.getVariants().stream()
                        .filter(v -> v.getId().equals(variantId))
                        .findFirst()
                        .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND)))
                .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

        variant.setStockQuantity(variant.getStockQuantity() + quantity);

        createInventoryLog(variant, quantity, actionType, user, reason);

        return buildStockResponse(variant);
    }

    /**
     * Lấy thông tin tồn kho hiện tại
     */
    @Transactional(readOnly = true)
    public StockResponse getStockLevel(Long variantId) {
        ProductVariant variant = productRepository.findById(variantId)
                .map(product -> product.getVariants().stream()
                        .filter(v -> v.getId().equals(variantId))
                        .findFirst()
                        .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND)))
                .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

        return buildStockResponse(variant);
    }

    @Transactional(readOnly = true)
    public List<InventoryLogResponse> getInventoryLogs(Long variantId) {
        ProductVariant variant = productRepository.findById(variantId)
                .map(product -> product.getVariants().stream()
                        .filter(v -> v.getId().equals(variantId))
                        .findFirst()
                        .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND)))
                .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

        return inventoryLogRepository.findByProductVariantOrderByCreatedAtDesc(variant)
                .stream()
                .map(this::buildInventoryLogResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryLogResponse> getInventoryLogsByDateRange(Long variantId, LocalDateTime startDate, LocalDateTime endDate) {
        ProductVariant variant = productRepository.findById(variantId)
                .map(product -> product.getVariants().stream()
                        .filter(v -> v.getId().equals(variantId))
                        .findFirst()
                        .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND)))
                .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

        return inventoryLogRepository.findByProductVariantAndCreatedAtBetweenOrderByCreatedAtDesc(variant, startDate, endDate)
                .stream()
                .map(this::buildInventoryLogResponse)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public boolean isLowStock(Long variantId) {
        ProductVariant variant = productRepository.findById(variantId)
                .map(product -> product.getVariants().stream()
                        .filter(v -> v.getId().equals(variantId))
                        .findFirst()
                        .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND)))
                .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

        return variant.getStockQuantity() <= lowStockThreshold;
    }

    /**
     * Tạo InventoryLog record
     */
    private void createInventoryLog(ProductVariant variant, Integer changeQuantity, String actionType, User user, String reason) {
        InventoryLog log = InventoryLog.builder()
                .productVariant(variant)
                .changeQuantity(changeQuantity)
                .actionType(actionType)
                .user(user)
                .reason(reason)
                .build();

        inventoryLogRepository.save(log);
    }

    private StockResponse buildStockResponse(ProductVariant variant) {
        return StockResponse.builder()
                .variantId(variant.getId())
                .sku(variant.getSku())
                .currentStock(variant.getStockQuantity())
                .isLowStock(variant.getStockQuantity() <= lowStockThreshold)
                .lowStockThreshold(lowStockThreshold)
                .build();
    }

    private InventoryLogResponse buildInventoryLogResponse(InventoryLog log) {
        return InventoryLogResponse.builder()
                .id(log.getId())
                .variantSku(log.getProductVariant().getSku())
                .changeQuantity(log.getChangeQuantity())
                .actionType(log.getActionType())
                .reason(log.getReason())
                .createdBy(log.getUser() != null ? log.getUser().getUsername() : "System")
                .createdAt(log.getCreatedAt())
                .build();
    }
}
