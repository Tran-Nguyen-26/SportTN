package com.ttn.sporttn.modules.order.dto.response;

import com.ttn.sporttn.modules.order.entity.OrderItem;
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
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private BigDecimal subtotal;

    public static OrderItemResponse from(OrderItem item) {
        BigDecimal subtotal = item.getPriceAtPurchase()
            .multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemResponse.builder()
            .id(item.getId())
            .variantId(item.getProductVariant().getId())
            .productName(item.getProductVariant().getProduct().getName())
            .productSku(item.getProductVariant().getSku())
            .quantity(item.getQuantity())
            .priceAtPurchase(item.getPriceAtPurchase())
            .subtotal(subtotal)
            .build();
    }
}
