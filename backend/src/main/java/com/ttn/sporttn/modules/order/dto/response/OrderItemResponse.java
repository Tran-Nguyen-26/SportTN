package com.ttn.sporttn.modules.order.dto.response;

import com.ttn.sporttn.modules.order.entity.OrderItem;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long id;
    private Long variantId;
    private String productName;
    private String productSku;
    private String imageUrl;
    private String color;
    private String size;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private BigDecimal subtotal;
    private boolean productStillAvailable;

    public static OrderItemResponse from(OrderItem item) {
        ProductVariant variant = item.getProductVariant();
        BigDecimal subtotal = item.getPriceAtPurchase()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        boolean available = variant != null && !variant.isDeleted();

        return OrderItemResponse.builder()
                .id(item.getId())
                .variantId(available ? variant.getId() : null)
                .productName(item.getSnapshotName() != null
                        ? item.getSnapshotName()
                        : (available ? variant.getProduct().getName() : "Sản phẩm không còn tồn tại"))
                .productSku(item.getSnapshotSku() != null
                        ? item.getSnapshotSku()
                        : (available ? variant.getSku() : null))
                .color(item.getSnapshotColor() != null
                        ? item.getSnapshotColor()
                        : (available ? variant.getColor() : null))
                .size(item.getSnapshotSize() != null
                        ? item.getSnapshotSize()
                        : (available ? variant.getSize() : null))
                .imageUrl(item.getSnapshotImageUrl() != null
                        ? item.getSnapshotImageUrl()
                        : (available ? variant.getMainImageUrl() : null))
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .subtotal(subtotal)
                .productStillAvailable(available)
                .build();
    }
}
